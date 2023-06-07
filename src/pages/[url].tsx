import CreateRoastForm from "@/components/CreateRoastForm";
import Roast from "@/components/Roast";
import SEO from "@/components/misc/SEO";
import { augmentRoasts } from "@/utils/augment-roasts";
import { useGlobalStyles } from "@/utils/use-global-styles";
import { Database } from "@lib/database.types";
import {
  Box,
  Button,
  Container,
  LoadingOverlay,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Roast = Database["public"]["Tables"]["roasts"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Site = { id: number; url: string };

interface AugmentedRoast extends Roast {
  profile?: Profile;
}

interface Props {
  userId: string | null;
  site: Site;
  roasts: Roast[] | null;
}

export default function RoastUrl({ userId, site, roasts }: Props) {
  const { classes } = useGlobalStyles();
  const [roastContent, roastContentSet] = useState("");

  const [loading, loadingSet] = useState(false);
  const [finalRoasts, finalRoastsSet] = useState<AugmentedRoast[]>();
  const supabase = useSupabaseClient();

  useEffect(() => {
    async function getRoasts() {
      if (!roasts) {
        return;
      }
      loadingSet(true);
      finalRoastsSet(await augmentRoasts(supabase, roasts));
    }

    if (!supabase || !roasts?.length) {
      return;
    }

    getRoasts()
      .catch(console.error)
      .finally(() => loadingSet(false));
  }, [supabase, roasts]);

  function renderRoasts() {
    return finalRoasts?.map((r) => {
      const profile = r.profile;
      const user = {
        username: profile?.username || "Unknown",
        avatar: profile?.avatar_url || undefined,
        twitter: profile?.twitter_profile || undefined,
        lifetime: profile?.lifetime_deal || false,
      };
      return (
        <Roast
          key={r.id}
          user={user}
          postedAt={new Date(r.created_at)}
          content={r.content}
        />
      );
    });
  }

  /**
   * 1. Find site entry in DB
   * 2. Find roasts assigned to site
   * 3. If no roasts, custom messaging to show user they're the first roast
   */
  return (
    <>
      <SEO
        title={`Roasts for ${site.url}`}
        description={`Roast for website ${site.url}`}
      />
      <main>
        <Container className={classes.pageWrapper}>
          <section id="title" className="mb-8">
            <Container p={0} size="xs">
              {finalRoasts && finalRoasts.length > 0 ? (
                <>
                  <Title
                    fz={{ base: 32, sm: 40 }}
                    mb="xs"
                    // className={classes.textAlign}
                  >
                    The roast of{" "}
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.linkSecondary}
                      href={`https://${site.url}`}
                    >
                      {site.url}
                    </Link>
                  </Title>
                </>
              ) : (
                <>
                  <Title mb="xs" fz={{ base: 32, sm: 40 }}>
                    There are no roasts for{" "}
                    <Link
                      target="_blank"
                      className={classes.linkSecondary}
                      href={`https://${site.url}`}
                    >
                      {site.url}
                    </Link>{" "}
                    yet
                  </Title>
                  <Text size="lg" mb="sm" color="dimmed">
                    But you can be the first to roast them!
                  </Text>
                </>
              )}
              <Button color="green" disabled>
                Claim ownerhsip (coming soon)
              </Button>
            </Container>
          </section>
          <section id="add-roast" className="mb-12">
            <Container p={0} size="xs">
              {userId ? (
                <>
                  <Title fz={{ base: 20, sm: 26 }} order={2} mb="xs">
                    Add your own roast
                  </Title>
                  <CreateRoastForm
                    onUpdate={(roast: string) => {
                      roastContentSet(roast);
                    }}
                  />
                  <Space h="md" />
                  <SubmitRoast
                    site={site}
                    content={roastContent}
                    userId={userId}
                  />
                </>
              ) : (
                <>
                  <Text size="xl" className={classes.textAlign}>
                    Please{" "}
                    <Link className={classes.linkPrimary} href="/login">
                      Login
                    </Link>{" "}
                    to submit your roast
                  </Text>
                </>
              )}
            </Container>
          </section>
          {finalRoasts && finalRoasts.length > 0 && (
            <section id="view-roasts" className="mb-12">
              <Container p={0} size="xs" mt={30}>
                <Title fz={{ base: 24, sm: 30 }} order={3} mb="xs">
                  See all roasts
                </Title>
                <Box pos="relative">
                  <LoadingOverlay visible={loading} />
                  <Stack spacing={10}>{renderRoasts()}</Stack>
                </Box>
              </Container>
            </section>
          )}
        </Container>
      </main>
    </>
  );
}

function SubmitRoast({
  content,
  site,
  userId,
}: {
  site: Site;
  content: string;
  userId: string;
}) {
  const router = useRouter();
  const supabase = useSupabaseClient<Database>();

  const onClick = async (e: any) => {
    e.preventDefault();

    if (!userId) {
      console.warn("Not logged in");
      return;
    }

    // Sanity check for text RIP
    if (!content.length) {
      console.warn("No content, can't submit roast");
      return;
    }

    let siteId = site.id;

    // Website doesn't exist yet
    if (siteId === -1) {
      const { data: createdWebsiteData, error: websiteCreateError } =
        await supabase
          .from("websites")
          .insert({ url: site.url })
          .select("id")
          .single();

      if (!createdWebsiteData || websiteCreateError) {
        console.error(websiteCreateError);
        alert("An error occurred while uploading your roast. Sorry!");
        return;
      }
      siteId = createdWebsiteData.id;
    }

    // When you press RETURN for new space, it renders like <p><br></p>
    // But when it renders, it's a really big space of emptiness. Better to remove it.
    const cleanContent = content.replaceAll("<p><br></p>", "");

    const { error } = await supabase
      .from("roasts")
      .insert({ content: cleanContent, site_id: siteId, user_id: userId });

    if (error) {
      console.error(error);
      alert("An error occurred while uploading your roast. Sorry!");
      return;
    }

    router.reload();
  };

  return <Button onClick={onClick}>Submit roast</Button>;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ url: string }>
): Promise<{
  props: Props;
}> {
  const siteUrl = context.params?.url!;

  const supabase = createPagesServerClient(context);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user.id ?? null;

  const { data: website } = await supabase
    .from("websites")
    .select("id, roasts(*)")
    .eq("url", siteUrl)
    .single();

  return {
    props: {
      userId,
      site: {
        id: website ? website.id : -1,
        url: siteUrl,
      },
      roasts: website ? (website.roasts.filter(Boolean) as Roast[]) : null,
    },
  };
}

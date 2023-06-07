import CreateRoastForm from "@/components/CreateRoastForm";
import Roast from "@/components/Roast";
import SEO from "@/components/misc/SEO";
import { useGlobalStyles } from "@/utils/use-global-styles";
import { Database } from "@lib/database.types";
import {
  Box,
  Button,
  Container,
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
import { useState } from "react";

type Roast = Database["public"]["Tables"]["roasts"]["Row"];
type Site = { id: number; url: string };
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AugmentedRoast extends Roast {
  profile?: Profile;
}

interface Props {
  userId: string | null;
  site: Site;
  roasts?: AugmentedRoast[];
}

export default function RoastUrl({ userId, site, roasts }: Props) {
  const { classes } = useGlobalStyles();
  const [roastContent, roastContentSet] = useState("");

  const hasRoasts = roasts ? roasts.length > 0 : false;

  const renderRoasts = roasts?.map((r) => {
    const profile = r.profile;
    const user = {
      username: profile?.username || "Unknown",
      avatar: profile?.avatar_url || undefined,
      twitter: profile?.twitter_profile || undefined,
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
            <Container p={0} size="sm">
              {hasRoasts ? (
                <>
                  <Title
                    fz={{ base: 32, sm: 40 }}
                    mb="xs"
                    className={classes.textAlign}
                  >
                    The roast of{" "}
                    <Link
                      target="_blank"
                      className={classes.linkSecondary}
                      href={`https://${site.url}`}
                    >
                      {site.url}
                    </Link>
                  </Title>
                </>
              ) : (
                <>
                  <Title
                    mb="xs"
                    fz={{ base: 32, sm: 40 }}
                    className={classes.textAlign}
                  >
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
                  <Text
                    size="lg"
                    mb="sm"
                    color="dimmed"
                    className={classes.textAlign}
                  >
                    But you can be the first to roast them!
                  </Text>
                </>
              )}
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
                  <AddRoast
                    site={site}
                    content={roastContent}
                    userId={userId}
                    // username={userData.username || ""}
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
          {hasRoasts && (
            <section id="view-roasts" className="mb-12">
              <Container p={0} size="xs" mt={30}>
                <Title fz={{ base: 24, sm: 30 }} order={3} mb="xs">
                  See all roasts
                </Title>
                <Stack spacing={10}>{renderRoasts}</Stack>
              </Container>
            </section>
          )}
        </Container>
      </main>
    </>
  );
}

function AddRoast({
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
    if (
      !content.length
      //  || content.length < minimumCharactersForRoast
    ) {
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

    const { error } = await supabase
      .from("roasts")
      .insert({ content, site_id: siteId, user_id: userId });

    if (error) {
      console.error(error);
      alert("An error occurred while uploading your roast. Sorry!");
      return;
    }

    router.reload();
  };

  return (
    <Box>
      <Button onClick={onClick}>Submit roast</Button>
    </Box>
  );
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

  // No website created yet, don't bother with roasts
  if (!website || !website.roasts) {
    return {
      props: {
        userId,
        site: {
          id: -1,
          url: siteUrl,
        },
      },
    };
  }

  const typedRoasts = website.roasts.filter(Boolean) as Roast[];
  const roastUserIds = typedRoasts.map((r) => r.user_id || "");

  // Basic roasts with no user Ids... would only happen if the user deleted the account
  if (!roastUserIds) {
    return {
      props: {
        userId,
        site: {
          id: website.id,
          url: siteUrl,
        },
        roasts: typedRoasts,
      },
    };
  }

  // Get user profiles
  const { data: profiles } = await supabase
    .from("profiles")
    // .select(`id, username, twitter_profile, avatar_url`)
    .select(`id, username, twitter_profile`)
    .in("id", roastUserIds);

  // Again shouldn't really happen, but just in case
  if (!profiles) {
    return {
      props: {
        userId,
        site: {
          id: website.id,
          url: siteUrl,
        },
        roasts: typedRoasts,
      },
    };
  }

  const typedProfile = profiles as Profile[];

  const profilesByUserId: Map<string, Profile> = new Map(
    typedProfile?.filter(Boolean).map((p) => [p.id, p])
  );

  const augmentedRoasts: AugmentedRoast[] = typedRoasts
    ?.filter(Boolean)
    .map((roast) => {
      const profile = profilesByUserId.get(roast.user_id || "");
      return {
        ...roast,
        profile,
      };
    });

  return {
    props: {
      userId,
      site: {
        id: website.id,
        url: siteUrl,
      },
      roasts: augmentedRoasts,
    },
  };
}

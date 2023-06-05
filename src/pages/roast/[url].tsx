/** TODO: CSS for visited link to remain unchanged */
import AddRoastForm from "@/components/AddRoastForm";
import Roast from "@/components/Roast";
import SEO from "@/components/SEO";
import { useGlobalStyles } from "@/utils/use-global-styles";
import { Database } from "@lib/database.types";
import { supabaseClient } from "@lib/supabase";
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
import { Editor } from "@tiptap/react";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

type Roast = Database["public"]["Tables"]["roast"]["Row"];
type Site = { id: number; url: string };
type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];

interface AugmentedRoast extends Roast {
  profile?: UserProfile;
}

interface Props {
  userId: string | null;
  site: Site;
  roasts?: AugmentedRoast[];
}

const minimumCharactersForRoast = 30;

export default function RoastUrl({ userId, site, roasts }: Props) {
  const { classes } = useGlobalStyles();
  const [roastContent, roastContentSet] = useState("");

  const hasRoasts = roasts ? roasts.length > 0 : false;

  const renderRoasts = roasts?.map((r) => {
    return (
      <Roast
        key={r.id}
        username={r.profile?.username || "Unknown"}
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
        title={`Roast ${site.url}`}
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
                      href={`https://${site}`}
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
                    Add your own roast roast
                  </Title>
                  <AddRoastForm
                    onUpdate={(editor: Editor) => {
                      const htmlContent = editor.getHTML();
                      roastContentSet(htmlContent);
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
          .from("site")
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
      .from("roast")
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
    .from("site")
    .select("id")
    .eq("url", siteUrl)
    .single();

  // No website created yet, don't bother with roasts
  if (!website) {
    console.warn("No entries for site, therefore no roasts");
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

  const { data: roasts } = await supabaseClient
    .from("roast")
    .select("*")
    .eq("site_id", website.id)
    .order("created_at", { ascending: false });

  const roastUserIds = roasts?.map((r) => r.user_id || "").filter(Boolean);

  const typedRoasts = roasts?.filter(Boolean) as Roast[];

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
    .select(`id, username, twitter_profile, avatar_url`)
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

  const typedProfile = profiles as UserProfile[];

  const profilesByUserId: Map<string, UserProfile> = new Map(
    typedProfile?.filter(Boolean).map((p) => [p.id, p])
  );

  const augmentedRoasts: AugmentedRoast[] = typedRoasts
    ?.filter(Boolean)
    .map((roast) => {
      const profile = profilesByUserId.get(roast.user_id || "");
      console.log({ profile, uid: roast.user_id });
      return {
        ...roast,
        profile,
      };
    });

  console.debug({ augmentedRoasts });

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

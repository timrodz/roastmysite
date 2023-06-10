import CreateRoastForm from "@/components/CreateRoastForm";
import WebsiteActionPanel from "@/components/WebsiteActionPanel";
import SEO from "@/components/misc/SEO";
import {
  AugmentedRoast,
  SessionUser,
  isUserPremium,
  supabaseClient,
} from "@/lib/supabase";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
// import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import RoastComponent from "@/components/Roast";
import { useGlobalStyles } from "@/utils/use-global-styles";
import { Database } from "@lib/database.types";
import {
  Button,
  Code,
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

const maxRoasts = {
  premium: 6,
  freeUser: 3,
};

async function getRoasts(
  url: string,
  userId?: string
): Promise<SSRQueryResult> {
  const sessionUser: SessionUser = userId
    ? {
        id: userId,
        isPremium: await isUserPremium(supabaseClient, userId),
      }
    : null;

  const query = await supabaseClient.rpc("get_posts_for_website", {
    url,
    // max_items: sessionUser?.isPremium ? maxRoasts.premium : maxRoasts.freeUser,
  });

  if (!query.data) {
    return {
      siteId: null,
      siteOwnerUserId: null,
      sessionUser,
      roasts: null,
    };
  }

  const { site_id, site_owner_id } = query.data[0];

  const roasts: AugmentedRoast[] = query.data?.map((d) => ({
    id: d.roast_id,
    createdAt: d.roast_created_at,
    content: d.roast_content,
    authorId: d.roast_author_id,
    authorUsername: d.author_username,
    authorTwitter: d.author_twitter_profile,
    authorMembershipStatus: d.author_membership_status,
  }));

  return {
    siteId: site_id,
    siteOwnerUserId: site_owner_id,
    sessionUser,
    roasts,
  };
}

interface SSRQueryResult {
  siteId: number | null;
  siteOwnerUserId: string | null;
  sessionUser: SessionUser | null;
  roasts: AugmentedRoast[] | null;
}

interface Props {
  url: string;
  browsingUserId?: string;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ url: string }>
): Promise<any> {
  const url = context.params?.url!;

  const supabase = createPagesServerClient(context);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery([`${url}_roasts`], () =>
    getRoasts(url, session?.user.id)
  );

  const dehydratedState = dehydrate(queryClient);

  return {
    props: {
      url,
      browsingUserId: session ? session.user.id : null,
      dehydratedState,
    },
  };
}

export default function UrlPage({ url, browsingUserId }: Props) {
  const { classes, theme } = useGlobalStyles();
  const [roastContent, roastContentSet] = useState("");

  const { data } = useQuery({
    queryKey: [`${url}_roasts`],
    queryFn: () => getRoasts(url, browsingUserId),
  });

  const finalRoasts = data?.roasts;
  const sessionUser = data?.sessionUser;
  const siteId = data?.siteId;

  function renderRoasts() {
    return finalRoasts?.map((roast, i) => {
      return (
        <RoastComponent key={i} browsingUserId={browsingUserId} {...roast} />
      );
    });
  }

  return (
    <>
      <SEO
        title={`Roasts for ${url}`}
        description={`Roast ${url} by giving it honest feedback.`}
      />
      <main>
        <Container className={classes.pageWrapper}>
          <section id="title" className="mb-8">
            <Container p={0} size="xs">
              {finalRoasts?.length ?? 0 > 0 ? (
                <>
                  <Title fz={{ base: 32, sm: 40 }} mb="xs">
                    The roast of{" "}
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.linkSecondary}
                      href={`https://${url}`}
                    >
                      {url}
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
                      href={`https://${url}`}
                    >
                      {url}
                    </Link>{" "}
                    yet
                  </Title>
                  <Text size="lg" mb="sm" color="dimmed">
                    But you can be the first to roast them!
                  </Text>
                </>
              )}
            </Container>
          </section>
          {siteId && (
            <section id="actions" className="mb-6">
              <WebsiteActionPanel
                siteId={siteId}
                siteUrl={url}
                browsingUserId={browsingUserId}
              />
            </section>
          )}
          <section id="add-roast" className="mb-12">
            <Container p={0} size="xs">
              {/* User logged in */}
              {browsingUserId ? (
                <>
                  <Title fz={{ base: 24, sm: 30 }} order={2} mb="xs">
                    Roast this site
                  </Title>
                  <CreateRoastForm
                    onUpdate={(roast: string) => {
                      roastContentSet(roast);
                    }}
                  />
                  <Space h="sm" />
                  <Text mb="md" size="sm" color="dimmed">
                    Note: images are an experimental feature. You can link them
                    with markdown formatting:{" "}
                    <Code fz="xs">
                      ![description](https://link-to-image.jpg)
                    </Code>
                    . They can&apos;t be uploaded to this site so it must
                    already exist elsewhere :)
                  </Text>
                  {siteId && (
                    <SubmitRoastButton
                      siteId={siteId}
                      siteUrl={url}
                      content={roastContent}
                      authorId={browsingUserId}
                    />
                  )}
                </>
              ) : (
                <>
                  {/* User not logged in */}
                  <Text size="lg">
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
          {(finalRoasts?.length ?? 0 > 0) && (
            <section id="view-roasts" className="mb-12">
              <Container p={0} size="xs" mt={30}>
                <Title fz={{ base: 24, sm: 30 }} order={3} mb="xs">
                  Roasts
                </Title>
                {/* <Box pos="relative"> */}
                {/* <LoadingOverlay visible={loading} /> */}
                <Stack spacing={15}>
                  {renderRoasts()}
                  {!sessionUser?.isPremium && (
                    <>
                      <Text
                        component="a"
                        target="_blank"
                        href="https://roastmysite.lemonsqueezy.com/checkout/buy/0c26096a-1be4-41ac-a05f-0dbb8addd747?discount=0"
                        color="indigo"
                        variant="light"
                      >
                        You&apos;re seeing a limited number of roasts. Purchase
                        a license to unlock them all!
                      </Text>
                    </>
                  )}
                </Stack>
                {/* </Box> */}
              </Container>
            </section>
          )}
        </Container>
      </main>
    </>
  );
}

function SubmitRoastButton({
  siteId,
  siteUrl,
  authorId,
  content,
}: {
  siteId: number;
  siteUrl: string;
  authorId: string;
  content: string;
}) {
  const router = useRouter();
  const supabase = useSupabaseClient<Database>();

  const onClick = async (e: any) => {
    e.preventDefault();

    if (!authorId) {
      console.warn("Not logged in");
      return;
    }

    // Sanity check for text RIP
    if (!content.length) {
      console.warn("No content, can't submit roast");
      return;
    }

    // Website doesn't exist yet
    if (siteId === -1) {
      const { data: createdWebsiteData, error: websiteCreateError } =
        await supabase
          .from("websites")
          .insert({ url: siteUrl })
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
      .insert({ content: cleanContent, site_id: siteId, user_id: authorId });

    if (error) {
      console.error(error);
      alert("An error occurred while uploading your roast. Sorry!");
      return;
    }

    router.reload();
  };

  return <Button onClick={onClick}>Submit roast</Button>;
}

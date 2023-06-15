import CreateRoastForm from "@components/CreateRoastForm";
import RoastComponent from "@components/Roast";
import WebsiteActionPanel from "@components/WebsiteActionPanel";
import SEO from "@components/misc/SEOComponent";
import { Database } from "@lib/database.types";
import {
  AugmentedRoast,
  SessionUser,
  augmentRoastsForWebsite,
  getServerSideSessionUser,
} from "@lib/supabase";
import {
  Box,
  Button,
  Code,
  Container,
  LoadingOverlay,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { sanitizeRoastUrl } from "@utils/url-sanity";
import { useGlobalStyles } from "@utils/use-global-styles";
import metadata, { CONSTANTS } from "@/lib/metadata";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Props {
  url: string;
  sessionUser: SessionUser;
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext<{ url: string }>
): Promise<any> {
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  let url = ctx.params?.url!;

  // Sanitize URL if possible
  const { sanitizedUrl, error } = sanitizeRoastUrl(url);
  if (!error) {
    url = sanitizedUrl;
  }

  const supabase = createPagesServerClient(ctx);
  const sessionUser = await getServerSideSessionUser(supabase);

  return {
    props: {
      url,
      sessionUser,
    },
  };
}

export default function UrlPage({ url, sessionUser }: Props) {
  const { classes } = useGlobalStyles();
  const [roastContent, roastContentSet] = useState("");
  const [performingAction, performingActionSet] = useState(false);

  const supabase = useSupabaseClient();

  const [finalRoasts, finalRoastsSet] = useState<AugmentedRoast[]>([]);
  const [siteId, siteIdSet] = useState<number | undefined>(-1);

  const { data, error, isLoading } = useQuery(
    sessionUser?.isPremium
      ? supabase.rpc("get_roasts_for_website", { url })
      : supabase
          .rpc("get_roasts_for_website", { url })
          .limit(CONSTANTS.MAX_ROASTS_FREE_USER)
  );

  useEffect(() => {
    if (error) {
      alert(
        "There was an error when getting all roasts for this website. Sorry!"
      );
    }
    if (!url || !supabase || !data) {
      return;
    }

    async function augmentRoasts() {
      const augmented = await augmentRoastsForWebsite(url, data);
      finalRoastsSet(augmented.roasts);
      siteIdSet(augmented.siteId || undefined);
    }

    augmentRoasts();
  }, [url, supabase, data, error]);

  function renderRoasts() {
    return finalRoasts?.map((roast, i) => {
      return <RoastComponent key={i} sessionUser={sessionUser} {...roast} />;
    });
  }

  return (
    <>
      <SEO
        title={`Roasts for ${url}`}
        description={`Roast ${url} by giving it honest feedback.`}
        forceViewportSizeConstant
      />
      <main>
        <Container
          px={{ base: "xl", sm: "md" }}
          className={classes.pageWrapper}
        >
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
          <section style={{ position: "relative" }} id="actions">
            <Container p={0} size="xs">
              <LoadingOverlay visible={performingAction} />

              {siteId && (
                <section id="actions" className="mb-6">
                  <WebsiteActionPanel
                    siteId={siteId}
                    siteUrl={url}
                    sessionUser={sessionUser}
                  />
                </section>
              )}
              <section id="add-roast" className="mb-12">
                <>
                  {/* User logged in */}
                  {sessionUser ? (
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
                      <Text mb="md" size="xs" color="dimmed">
                        Note: images are an experimental feature. Add them with
                        markdown:{" "}
                        <Code fz="xs">
                          ![description](https://link-to-image.jpg)
                        </Code>
                        . They can&apos;t be uploaded to this site so they must
                        already exist elsewhere.
                      </Text>
                      <SubmitRoastButton
                        siteId={siteId || -1}
                        siteUrl={url}
                        content={roastContent}
                        authorId={sessionUser.id}
                        onPerformActionStart={() => performingActionSet(true)}
                        onPerformActionEnd={() => performingActionSet(false)}
                      />
                    </>
                  ) : (
                    <>
                      {/* User not logged in */}
                      <Text size="lg">
                        Please{" "}
                        <Link
                          className={classes.linkPrimary}
                          href="/login"
                          rel="canonical"
                        >
                          Login
                        </Link>{" "}
                        to submit your roast
                      </Text>
                    </>
                  )}
                </>
              </section>
              {(finalRoasts?.length ?? 0 > 0) && (
                <section id="view-roasts" className="mb-12">
                  <>
                    <Title fz={{ base: 24, sm: 30 }} order={3} mb="xs">
                      Roasts
                    </Title>
                    <Box pos="relative">
                      <LoadingOverlay visible={isLoading} />
                      <Stack spacing={15}>
                        {renderRoasts()}
                        {!sessionUser?.isPremium && (
                          <>
                            <Text
                              component="a"
                              target="_blank"
                              href={metadata.lifetimeDeal.checkoutLink}
                              color="indigo"
                              variant="light"
                            >
                              You&apos;re seeing a limited number of roasts.
                              Purchase a license to unlock them all!
                            </Text>
                          </>
                        )}
                      </Stack>
                    </Box>
                  </>
                </section>
              )}
            </Container>
          </section>
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
  onPerformActionStart,
  onPerformActionEnd,
}: {
  siteId: number;
  siteUrl: string;
  authorId: string;
  content: string;
  onPerformActionStart: any;
  onPerformActionEnd: any;
}) {
  const router = useRouter();
  const supabase = useSupabaseClient<Database>();

  const onClick = async (e: any) => {
    e.preventDefault();

    if (!authorId) {
      return;
    }

    // Sanity check for text RIP
    if (!content.length) {
      return;
    }

    onPerformActionStart();

    // Website doesn't exist yet
    if (siteId === -1) {
      const { data: createdWebsiteData, error: websiteCreateError } =
        await supabase
          .from("websites")
          .insert({ url: siteUrl })
          .select("id")
          .limit(1)
          .single();

      if (!createdWebsiteData || websiteCreateError) {
        console.error(websiteCreateError);
        onPerformActionEnd();
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
      onPerformActionEnd();
      return;
    }
    router.reload();
  };

  return (
    <Button onClick={onClick} aria-label="Submit roast">
      Submit roast
    </Button>
  );
}

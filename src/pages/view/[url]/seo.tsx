import SEO from "@components/misc/SEOComponent";
import {
  SessionUser,
  getServerSideSessionUser,
  getSiteForOwner,
} from "@lib/supabase";
import { useGlobalStyles } from "@utils/use-global-styles";
import { Button, Center, Container, Text, Title } from "@mantine/core";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";

interface Props {
  sessionUser: SessionUser;
  siteId: number | null;
  siteUrl: string;
}

export default function WebsiteSEO({ sessionUser, siteId, siteUrl }: Props) {
  const { classes } = useGlobalStyles();

  const SiteUrl = (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      className={classes.linkSecondary}
      href={`https://${siteUrl}`}
    >
      {siteUrl}
    </Link>
  );

  const underConstruction = (
    <>
      <Text mt="xl" fz={24} className={classes.textAlign}>
        ⚠️ This page is under construction ⚠️
      </Text>
    </>
  );

  if (!sessionUser) {
    return (
      <>
        <SEO
          title={`SEO suggestions for ${siteUrl}`}
          description={`See what improvements can be made to ${siteUrl} with Roast My Site's SEO assistant`}
        />
        <main>
          <Container size="md" className={classes.pageWrapper}>
            <section id="search">
              <Title mb="xl" className={classes.textAlign}>
                You must login to see the SEO suggestions for {SiteUrl}
              </Title>
              <Center>
                <Button
                  component="a"
                  href="/login"
                  rel="canonical"
                  size="lg"
                  aria-label="Login"
                >
                  Login
                </Button>
              </Center>
            </section>
          </Container>
        </main>
      </>
    );
  }

  if (!siteId) {
    return (
      <>
        <SEO
          title={`SEO suggestions for ${siteUrl}`}
          description={`See what improvements can be made to ${siteUrl} with Roast My Site's SEO assistant`}
        />
        <main>
          <Container size="md" className={classes.pageWrapper}>
            <section id="search">
              <Title className={classes.textAlign}>
                You&apos;re not the owner of {SiteUrl}
              </Title>
              {underConstruction}
            </section>
          </Container>
        </main>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`SEO suggestions for ${siteUrl}`}
        description={`See what improvements can be made to ${siteUrl} with Roast My Site's SEO assistant`}
      />
      <main>
        <Container size="md" className={classes.pageWrapper}>
          <section id="search">
            <Title className={classes.textAlign}>
              You&apos;re the owner of {SiteUrl}
            </Title>
            {underConstruction}
          </section>
        </Container>
      </main>
    </>
  );
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext<{ url: string }>
): Promise<{ props: Props }> {
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const url = ctx.params?.url!;

  const supabase = createPagesServerClient(ctx);
  const sessionUser = await getServerSideSessionUser(supabase);

  if (!sessionUser) {
    return {
      props: {
        sessionUser: null,
        siteId: null,
        siteUrl: url,
      },
    };
  }

  const siteId = await getSiteForOwner(url, sessionUser.id);

  console.log({ siteId, sessionUser });

  return {
    props: {
      sessionUser,
      siteId,
      siteUrl: url,
    },
  };
}

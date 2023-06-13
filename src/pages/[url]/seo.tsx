import SEO from "@components/misc/SEOComponent";
import {
  SessionUser,
  getServerSideSessionUser,
  getSiteForOwner,
} from "@lib/supabase";
import { useGlobalStyles } from "@/pages/utils/use-global-styles";
import { Button, Center, Container, Title } from "@mantine/core";
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
                <Button component="a" href="/login" size="lg">
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
          </section>
        </Container>
      </main>
    </>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ url: string }>
): Promise<{ props: Props }> {
  const url = context.params?.url!;

  const supabase = createPagesServerClient(context);
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

  return {
    props: {
      sessionUser,
      siteId,
      siteUrl: url,
    },
  };
}

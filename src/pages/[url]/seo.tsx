import SEO from "@/components/misc/SEO";
import StartRoastingCTA from "@/components/cta/StartRoastingCTA";
import TopRoasts from "@/components/TopRoasts";
import { isUserPremiumSSR, supabaseClient } from "@/lib/supabase";
import { useGlobalStyles } from "@/utils/use-global-styles";
import { Button, Center, Container, Text, Title } from "@mantine/core";
import { GetServerSidePropsContext } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

type Site = { id: number | null; url: string };

interface Props {
  userId: string | null;
  site: Site;
  isBrowsingUserOwner: boolean;
}

export default function WebsiteSEO({
  userId,
  site,
  isBrowsingUserOwner,
}: Props) {
  const { classes } = useGlobalStyles();

  const SiteUrl = (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      className={classes.linkSecondary}
      href={`https://${site.url}`}
    >
      {site.url}
    </Link>
  );

  if (!userId) {
    return (
      <>
        <SEO
          title={`SEO suggestions for ${site.url}`}
          description={`See what improvements can be made to ${site.url} with Roast My Site's SEO assistant`}
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

  if (!isBrowsingUserOwner) {
    return (
      <>
        <SEO
          title={`SEO suggestions for ${site.url}`}
          description={`See what improvements can be made to ${site.url} with Roast My Site's SEO assistant`}
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
        title={`SEO suggestions for ${site.url}`}
        description={`See what improvements can be made to ${site.url} with Roast My Site's SEO assistant`}
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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      props: {
        userId: null,
        site: {
          id: null,
          url,
        },
        isBrowsingUserOwner: false,
      },
    };
  }

  const userId = session.user.id;

  const { data: siteData } = await supabaseClient
    .from("websites")
    .select("id")
    .match({ url, owned_by_user_id: userId })
    .maybeSingle();

  if (!siteData) {
    console.log(`User ${userId} is not owner of website ${url}`);
    return {
      props: {
        userId,
        site: {
          id: null,
          url,
        },
        isBrowsingUserOwner: false,
      },
    };
  }

  const userPremium = await isUserPremiumSSR(supabase, userId);

  return {
    props: {
      userId,
      site: {
        id: siteData.id,
        url,
      },
      isBrowsingUserOwner: !!userPremium?.id,
    },
  };
}

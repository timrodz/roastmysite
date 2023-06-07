import SEO from "@/components/misc/SEO";
import StartRoastingCTA from "@/components/cta/StartRoastingCTA";
import TopRoasts from "@/components/TopRoasts";
import { supabaseClient } from "@/lib/supabase";
import { useGlobalStyles } from "@/utils/use-global-styles";
import { Container, Text } from "@mantine/core";

interface Roast {
  url: string;
  count: number;
}

interface Props {
  topRoasts: Roast[] | null;
}

export default function RoastPage({ topRoasts }: Props) {
  const { classes } = useGlobalStyles();

  return (
    <>
      <SEO title="Roast search" description="All roasts for Roast My Site" />
      <main>
        <Container size="md" className={classes.pageWrapper}>
          <section id="search">
            <Text
              fw={600}
              fz={{ base: 26, sm: 38 }}
              className={classes.textAlign}
            >
              Search for a website to roast ↓
            </Text>
            <Text
              mb="md"
              fz={{ base: 17, sm: 18 }}
              color="dimmed"
              className={classes.textAlign}
            >
              ...or roast any website you want
            </Text>
            <StartRoastingCTA />
          </section>
          {topRoasts && topRoasts.length > 0 && (
            <section id="roasts">
              <TopRoasts title="Top roasts" roasts={topRoasts} />
            </section>
          )}
        </Container>
      </main>
    </>
  );
}

export async function getServerSideProps(): Promise<{
  props: { topRoasts: Roast[] | nullreplace(/[^a-z0-9.]/ };
}> {
  const { data } = await supabaseClient
    .from("websites")
    .select("url, roast_count")
    .order("roast_count", { ascending: false })
    .limit(3);

  const topRoasts: Roast[] | null =
    data?.filter(Boolean).map((site) => ({
      url: site.url,
      count: site.roast_count as number,
    })) || null;

  return {
    props: {
      topRoasts,
    },
  };
}
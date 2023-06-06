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
  topRoasts: Roast[];
}

export default function RoastPage({ topRoasts }: Props) {
  const { classes } = useGlobalStyles();

  return (
    <>
      <SEO title="Roasts" description="All roasts for Roast My Site" />
      <main>
        <Container size="md" className={classes.pageWrapper}>
          <section id="search">
            <Text
              mb={5}
              fw={600}
              fz={{ base: 26, sm: 38 }}
              className={classes.textAlign}
            >
              Search for a website to roast ↓
            </Text>
            <StartRoastingCTA />
          </section>
          <section id="roasts">
            <TopRoasts title="Top roasts" roasts={topRoasts} />
          </section>
        </Container>
      </main>
    </>
  );
}

export async function getServerSideProps(): Promise<{
  props: { topRoasts: Roast[] };
}> {
  let { data } = await supabaseClient
    .from("websites")
    .select("url, roast_count")
    .order("roast_count", { ascending: false })
    .limit(3);

  const topRoasts: Roast[] =
    data?.filter(Boolean).map((site) => ({
      url: site.url,
      count: site.roast_count as number,
    })) || [];

  return {
    props: {
      topRoasts,
    },
  };
}

import TopRoasts from "@components/TopRoasts";
import StartRoastingCTA from "@components/cta/StartRoastingCTA";
import SEO from "@components/misc/SEOComponent";
import { useGlobalStyles } from "@/pages/utils/use-global-styles";
import { Container, Text } from "@mantine/core";

export default function RoastPage() {
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
          <TopRoasts title="Top roasts" />
        </Container>
      </main>
    </>
  );
}

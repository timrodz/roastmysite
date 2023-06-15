import TopRoasts from "@components/TopRoasts";
import StartRoastingCTA from "@components/cta/StartRoastingCTA";
import SEO from "@components/misc/SEOComponent";
import { useGlobalStyles } from "@utils/use-global-styles";
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
              mb="md"
              className={classes.textAlign}
            >
              Search for a website to roast ↓
            </Text>
            <StartRoastingCTA />
          </section>
          <section id="top-roasts" className="mb-32">
            <TopRoasts title="Top roasts" />
          </section>
        </Container>
      </main>
    </>
  );
}

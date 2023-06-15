import FAQ from "@/components/FAQ";
import metadata from "@/lib/metadata";
import Pricing from "@components/Pricing";
import TopRoasts from "@components/TopRoasts";
import StartRoastingCTA from "@components/cta/StartRoastingCTA";
import Dots from "@components/misc/LandingDots";
import SEO from "@components/misc/SEOComponent";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import { IconFlame } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    zIndex: 0,
    paddingBottom: rem(60),
    paddingTop: rem(120),

    [theme.fn.smallerThan("sm")]: {
      paddingTop: rem(70),
    },
  },

  dots: {
    position: "absolute",
    color: theme.colors.gray[1],

    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  textAlign: {
    textAlign: "center",
    [theme.fn.smallerThan("xs")]: {
      textAlign: "left",
    },
  },

  highlight: {
    position: "relative",
    backgroundColor: theme.colors.orange[1],
    borderRadius: theme.radius.sm,
    padding: `${rem(1)} ${rem(12)} ${rem(6)} ${rem(12)}`,
  },
}));

export default function Home() {
  const { classes } = useStyles();

  return (
    <>
      <SEO
        isLandingPage
        title="Roast My Site — Grow your website with public, honest feedback"
        description="Get insights for your business with feedback that helps you grow. Discover insider knowledge from a network of reputable founders."
      />
      <main>
        <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
        <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
        <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
        <Dots className={classes.dots} style={{ right: 0, top: 60 }} />
        <Container className={classes.wrapper}>
          <section id="hero" className="mb-28 lg:mb-48">
            {/* Title */}
            <Title
              order={1}
              fz={{ base: 32, sm: 50 }}
              fw={800}
              lts={-1}
              mb="xl"
              className={classes.textAlign}
            >
              Your website&apos;s{" "}
              <span className={classes.highlight}>roasts</span> are now public
            </Title>

            {/* Subtitle */}
            <Container size={600} p={0} mb={40}>
              <Text
                fz={{ base: 20, sm: 22 }}
                color="dimmed"
                className={classes.textAlign}
              >
                Grow your website with public, honest feedback. Discover insider
                knowledge from a network of reputable founders
              </Text>
            </Container>

            {/* CTA: site search */}
            <Container size="sm" p={0}>
              <Text
                fw={600}
                fz={{ base: 22, sm: 32 }}
                className={classes.textAlign}
              >
                See how your website is doing ↓
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
              {/* Dictionary */}
              {/* <Box mx="auto"> */}
              <Divider />
              <Box maw={600} mx="auto">
                <Text
                  italic
                  mt={40}
                  mb={30}
                  // size="sm"
                  color="dimmed"
                  className={classes.textAlign}
                >
                  We define a roast (rəʊst): as the act of giving & receiving
                  feedback on our products. It helps us get an outsider view
                  into our products.
                </Text>
              </Box>
              {/* </Box> */}
            </Container>
          </section>
          <section id="features" className="mb-28 lg:mb-48">
            <Title
              order={2}
              fw={800}
              fz={{ base: 24, sm: 36 }}
              mb="md"
              className={classes.textAlign}
            >
              Actionable results in no time
            </Title>
            <Text
              mb={50}
              color="dimmed"
              fz={{ base: 18, sm: 20 }}
              className={classes.textAlign}
            >
              Receive feedback that helps you grow, in a matter of minutes.
            </Text>
            <Features />
            <GetStartedCTA />
          </section>
          <section id="roasts" className="mb-32">
            <TopRoasts title="See the top roasts" />
            <GetStartedCTA />
          </section>
          {/* <section id="frequently-asked-questions" className="mb-32">
            <FAQ />
          </section> */}
          <section id="pricing" className="mb-32">
            <Pricing />
          </section>
        </Container>
      </main>
    </>
  );
}

function GetStartedCTA() {
  return (
    <Flex
      mt={60}
      align={{ base: "stretch", xs: "center" }}
      justify={{ base: "start", xs: "center" }}
      direction="column"
      gap={10}
    >
      <Button
        size="xl"
        miw={300}
        component="a"
        href="/login"
        rel="canonical"
        leftIcon={<IconFlame />}
        aria-label="Start roasting now"
      >
        Start roasting now
      </Button>
    </Flex>
  );
}

function Features() {
  const items = metadata.features.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon size={44} radius="md" variant="light" color="green">
        <feature.icon size={rem(26)} stroke={1.5} />
      </ThemeIcon>
      <Text fz="lg" mt="sm" fw={500}>
        {feature.title}
      </Text>
      <Text c="dimmed" fz="sm">
        {feature.description}
      </Text>
    </div>
  ));

  return (
    <Container p={0}>
      <SimpleGrid
        cols={3}
        spacing={30}
        breakpoints={[{ maxWidth: "md", cols: 1 }]}
      >
        {items}
      </SimpleGrid>
    </Container>
  );
}

import Pricing from "@/components/Pricing";
import Roast from "@/components/Roast";
import TopRoasts from "@/components/TopRoasts";
import StartRoastingCTA from "@/components/cta/StartRoastingCTA";
import Dots from "@/components/misc/LandingDots";
import SEO from "@/components/misc/SEO";
import {
  Box,
  Container,
  Divider,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import { IconNumber1, IconNumber2, IconNumber3 } from "@tabler/icons-react";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    zIndex: 1,
    paddingBottom: rem(60),
    paddingTop: rem(150),

    [theme.fn.smallerThan("sm")]: {
      paddingTop: rem(120),
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

interface Roast {
  url: string;
  count: number;
}

const featureArray = [
  {
    title: "Visit the website you want to roast",
    icon: IconNumber1,
    description:
      "This will help you prepare your roast. Try act as a field expert, but also a newbie. Everyone is a potential customer.",
  },
  {
    title: "Room for improvement",
    icon: IconNumber2,
    description:
      "Have you noticed what works well and what doesn't? Chances are, the founder needs to know this!",
  },
  {
    title: "Roast the website!",
    icon: IconNumber3,
    description:
      "Share the love by letting the founder publicly know how they can improve their website and land those customers.",
  },
];

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
                  size="sm"
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
          <section id="features" className="mb-28 lg:mb-60">
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
            <Text
              mt={70}
              mb="md"
              fw={600}
              fz={{ base: 22, sm: 32 }}
              className={classes.textAlign}
            >
              Start roasting ↓
            </Text>
            <StartRoastingCTA />
          </section>
          <TopRoasts title="See the top roasts" className="mb-60" />
          <section id="pricing" className="mb-32">
            <Pricing />
          </section>
        </Container>
      </main>
    </>
  );
}

function Features() {
  const items = featureArray.map((feature) => (
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

import Dots from "@/components/LandingDots";
import Roast from "@/components/Roast";
import SEO from "@/components/SEO";
import { supabaseClient } from "@/lib/supabase";
import { sanitizeRoastUrl } from "@/utils/url-sanity";
import {
  Box,
  Button,
  Col,
  Container,
  Divider,
  Flex,
  Grid,
  SimpleGrid,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import {
  IconFlame,
  IconNumber1,
  IconNumber2,
  IconNumber3,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    zIndex: 1,
    paddingBottom: rem(60),
    paddingTop: rem(180),

    [theme.fn.smallerThan("sm")]: {
      paddingTop: rem(120),
    },
  },

  dots: {
    position: "absolute",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[1],

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
    backgroundColor: theme.colors.green[1],
    borderRadius: theme.radius.sm,
    padding: `${rem(4)} ${rem(12)} ${rem(6)} ${rem(12)}`,
  },

  typeYourSiteInput: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: 0,
  },

  typeYourSiteInputWrapper: {
    width: "100%",
    flex: "1",
  },

  typeYourSiteButton: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },

  roast: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: theme.radius.md,
    height: rem(90),
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease, transform 100ms ease",

    "&:hover": {
      boxShadow: theme.shadows.md,
      transform: "scale(1.05)",
    },
  },
}));

interface Roast {
  url: string;
  roastCount: number;
}

interface Props {
  topRoasts: Roast[];
  isSignedIn: boolean;
}

const features = [
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

export default function Home({ topRoasts, isSignedIn }: Props) {
  const router = useRouter();
  const { classes } = useStyles();

  const [siteToRoast, siteToRoastSet] = useState("");
  const [formError, formErrorSet] = useState("");

  const onClickCTA = (e: any) => {
    e.preventDefault();

    const { sanitizedUrl, error } = sanitizeRoastUrl(siteToRoast);

    if (error) {
      formErrorSet(error);
      return;
    }

    router.push(`/roast/${sanitizedUrl}`);
  };

  return (
    <>
      <SEO
        title="Roast My Site — Supercharge your landing pages with feedback"
        description="Get insights for your business with feedback that helps you grow. Discover insider knowledge from a network of reputable founders."
      />
      <main>
        <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
        <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
        <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
        <Dots className={classes.dots} style={{ right: 0, top: 60 }} />
        <Container className={classes.wrapper}>
          {/* Hero */}
          <section id="hero" className="mb-28 lg:mb-48">
            {/* Title */}
            <Title
              order={1}
              fz={{ base: 32, sm: 40 }}
              fw={800}
              lts={-1}
              mb="xl"
              className={classes.textAlign}
            >
              Convert visitors into{" "}
              <span className={classes.highlight}>paying customers</span>
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
              <Text mb="md" color="dimmed" className={classes.textAlign}>
                ...or roast any website you want
              </Text>
              <Box mb={60} maw={500} mx="auto">
                <Flex align="center">
                  <TextInput
                    type="url"
                    placeholder="roastmysite.com"
                    size="lg"
                    icon={<IconFlame size="1.5rem" stroke={1.5} />}
                    classNames={{
                      input: classes.typeYourSiteInput,
                      root: classes.typeYourSiteInputWrapper,
                    }}
                    error={formError.length > 0}
                    value={siteToRoast}
                    onChange={(e) => {
                      // Reset form error if there was one
                      if (formError) {
                        formErrorSet("");
                      }
                      siteToRoastSet(e.target.value);
                    }}
                  />
                  <Button
                    size="lg"
                    className={classes.typeYourSiteButton}
                    onClick={onClickCTA}
                  >
                    Go
                  </Button>
                </Flex>
                {formError && (
                  <Text
                    color="red"
                    mt={10}
                    size="sm"
                    className={classes.textAlign}
                  >
                    {formError}
                  </Text>
                )}
              </Box>
              {/* Dictionary */}
              <Box maw={600} mx="auto">
                <Divider />
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
            </Container>
          </section>
          <section id="features" className="mb-28 lg:mb-48">
            <Title
              order={2}
              fz={{ base: 36, sm: 40 }}
              mb="md"
              className={classes.textAlign}
            >
              Actionable results in no time
            </Title>
            <Text mb={70} color="dimmed" className={classes.textAlign}>
              dasdasdas
            </Text>
            <Features />
          </section>
          <section id="top-roasts" className="mb-12">
            <Title
              order={3}
              fz={{ base: 32, sm: 38 }}
              mb="lg"
              className={classes.textAlign}
            >
              Don't want to roast yet?
            </Title>
            <RenderRoasts roasts={topRoasts} />
          </section>
        </Container>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      topRoasts: [
        {
          url: "twitter.com",
          roastCount: 10,
        },
        {
          url: "resumebeaver.com",
          roastCount: 6,
        },
        {
          url: "timrodz.dev",
          roastCount: 3,
        },
      ],
    },
  };
  let { data } = await supabaseClient
    .from("site")
    .select("url, roast(count)")
    .limit(3);

  const topRoasts = data?.filter(Boolean).map((d) => ({
    url: d.url,
    roastCount: d.roast.length,
  }));

  return {
    props: {
      topRoasts,
    },
  };
}

function RenderRoasts({ roasts }: { roasts: Roast[] }) {
  const router = useRouter();
  if (!roasts.length) {
    return null;
  }
  return (
    <Container p={0} maw={600}>
      <SimpleGrid
        cols={3}
        breakpoints={[{ maxWidth: "36rem", cols: 1, spacing: "sm" }]}
      >
        {roasts
          .sort((a, b) => b.roastCount - a.roastCount)
          .map((roast) => (
            <Button
              key={roast.url}
              variant="light"
              color="orange"
              onClick={(e) => {
                e.preventDefault();
                router.push(`/roast/${roast.url}`);
              }}
            >
              {roast.url}
            </Button>
          ))}
      </SimpleGrid>
    </Container>
  );
}

function Features() {
  const router = useRouter();
  const { classes, theme } = useStyles();

  const items = features.map((feature) => (
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
    <Container p={0} size="md">
      {/* <Grid gutter={80}> */}
      {/* <Col> */}
      <SimpleGrid
        cols={3}
        spacing={30}
        breakpoints={[{ maxWidth: "md", cols: 1 }]}
      >
        {items}
      </SimpleGrid>
      {/* </Col> */}
      {/* // </Grid> */}
    </Container>
  );
}

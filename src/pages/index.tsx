import Dots from "@/components/LandingDots";
import Roast from "@/components/Roast";
import SEO from "@/components/SEO";
import { supabaseClient } from "@/lib/supabase";
import { sanitizeRoastUrl } from "@/utils/url-sanity";
import {
  Button,
  Container,
  Flex,
  SimpleGrid,
  Text,
  TextInput,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import { IconFlame } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import path from "path";
import { MouseEvent, useState } from "react";

const useStyles = createStyles((theme) => ({
  hero: {
    position: "relative",
    zIndex: 1,
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

  title: {
    textAlign: "center",
    fontWeight: 800,
    fontSize: rem(40),
    letterSpacing: -1,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(34),
      textAlign: "left",
    },
  },

  subTitle: {
    textAlign: "center",
    marginBottom: theme.spacing.xs,

    [theme.fn.smallerThan("xs")]: {
      textAlign: "left",
    },
  },

  textAlignMd: {
    fontSize: rem(32),
    textAlign: "center",
    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(28),
      textAlign: "left",
    },
  },

  textAlignSm: {
    fontSize: rem(28),
    textAlign: "center",
    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(24),
      textAlign: "left",
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

  // description: {
  //   textAlign: "center",

  //   [theme.fn.smallerThan("xs")]: {
  //     textAlign: "left",
  //     fontSize: theme.fontSizes.md,
  //   },
  // },

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

export default function Home({ topRoasts, isSignedIn }: Props) {
  const router = useRouter();
  const { classes } = useStyles();

  const [siteToRoast, siteToRoastSet] = useState("");
  const [formError, formErrorSet] = useState("");

  const onRoastClick = (e: any) => {
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
        description="Get insights for your business with feedback that helps you grow. Discover insider knowledge from a network of reputable business owners, makers and indies."
        type="website"
        url="https://www.resumebeaver.com"
        bareDomain="www.resumebeaver.com"
        image={{
          url: "https://resumebeaver.com/thumbnail.png",
          alt: "Resume Beaver",
          width: "1200",
          height: "630",
        }}
      />
      <main>
        <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
        <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
        <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
        <Dots className={classes.dots} style={{ right: 0, top: 60 }} />
        <section>
          <Container
            pt={{ base: 50, sm: 90 }}
            pb={60}
            className={classes.hero}
            size="lg"
          >
            {/* Title */}
            <Title className={classes.title}>
              Convert visitors into{" "}
              <span className={classes.highlight}>paying customers</span>
            </Title>

            {/* Subtitle */}
            <Container size={600} p={0} mb="xl">
              <Text size="lg" color="dimmed" className={classes.subTitle}>
                Grow your business with public, honest feedback. Discover
                insider knowledge from a network of reputable makers
              </Text>
            </Container>

            {/* CTA: site search */}
            <Container size="sm" p={0} mb={{ base: "xl", sm: 60 }}>
              <Title order={2} mb="xs" className={classes.textAlignMd}>
                Roast any site ↓
              </Title>
              <Flex align="center" maw={400} mx="auto">
                <TextInput
                  type="url"
                  placeholder="https://twitter.com"
                  radius="xl"
                  size="md"
                  icon={<IconFlame size="1.1rem" stroke={1.5} />}
                  classNames={{
                    input: classes.typeYourSiteInput,
                    root: classes.typeYourSiteInputWrapper,
                  }}
                  error={formError}
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
                  size="md"
                  radius="xl"
                  className={classes.typeYourSiteButton}
                  onClick={(e) => onRoastClick(e)}
                >
                  Start roasting
                </Button>
              </Flex>
            </Container>

            {/* Roasts */}
            <Container size="md" p={0} mb="xs">
              <RenderRoasts roasts={topRoasts} />
            </Container>
          </Container>
        </section>
      </main>
    </>
  );
}

function RenderRoasts({ roasts }: { roasts: Roast[] }) {
  const router = useRouter();
  const { classes } = useStyles();
  if (!roasts.length) {
    return null;
  }
  return (
    <>
      <Title align="center" order={3} className={classes.textAlignSm} mb="lg">
        See the sites with most roasts
      </Title>
      <Container p={0} maw={600}>
        <SimpleGrid
          cols={3}
          breakpoints={[{ maxWidth: "36rem", cols: 1, spacing: "sm" }]}
        >
          {roasts.map((roast) => (
            <Button
              key={roast.url}
              variant="light"
              color="red"
              onClick={(e) => router.push(`/roast/${roast.url}`)}
            >
              {roast.url}
            </Button>
          ))}
        </SimpleGrid>
      </Container>
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

import Dots from "@/components/LandingDots";
import Roast from "@/components/Roast";
import SEO from "@/components/SEO";
import { supabaseClient } from "@/lib/supabase";
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

  description: {
    textAlign: "center",

    [theme.fn.smallerThan("xs")]: {
      textAlign: "left",
      fontSize: theme.fontSizes.md,
    },
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

{
  /* {!session ? (
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={["github"]}
        />
      ) : (
        <p>Account page will go here.</p>
      )} */
}

interface Roast {
  url: string;
  roastCount: number;
}

interface Props {
  topRoasts: Roast[];
  isSignedIn: boolean;
}

export default function Home({ topRoasts, isSignedIn }: Props) {
  const { classes, theme } = useStyles();

  return (
    <>
      <SEO
        title="Roast My Landing — Supercharge your business"
        description="Perfect your applications and land that dream job. Your next job
      is just a few clicks away! Join the waitlist →"
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
        <Container
          pt={{ base: 50, sm: 90 }}
          pb={60}
          className={classes.hero}
          size="lg"
        >
          <Title className={classes.title}>
            Convert visitors into{" "}
            <span className={classes.highlight}>paying customers</span>
          </Title>

          {/* Subtitle */}
          <Container
            size={600}
            pt="xs"
            mb={{ base: 30, sm: 30 }}
            px={{ base: "0", sm: "md" }}
          >
            <Text size="xl" color="dimmed" className={classes.description}>
              Improve your landing pages with honest feedback from makers who{" "}
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://twitter.com/search?q=%23buildinpublic"
              >
                #buildinpublic
              </Link>
              . Submit your roasts and get roasted
            </Text>
          </Container>

          {/* Type your site version */}
          <Container
            size="sm"
            pt="lg"
            mb={{ base: 30, sm: 30 }}
            px={{ base: "0", sm: "md" }}
          >
            <Title order={2} mb="md" className={classes.textAlignMd}>
              Roast any site ↓
            </Title>
            <Container p={0} size="xs">
              <Flex>
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
                />
                <Button
                  size="md"
                  radius="xl"
                  className={classes.typeYourSiteButton}
                >
                  Start roasting
                </Button>
              </Flex>
            </Container>
          </Container>
          <RenderRoasts roasts={topRoasts} />
        </Container>
      </main>
    </>
  );
}

function RenderRoasts({ roasts }: { roasts: Roast[] }) {
  const { classes } = useStyles();
  if (!roasts.length) {
    return null;
  }
  return (
    <Container pt="lg" mb="xs" px={{ base: "0", sm: "md" }}>
      <Title align="center" order={3} className={classes.textAlignSm} mb="lg">
        See the sites with most roasts
      </Title>
      <Container maw={700} px={{ base: "0", sm: "md" }}>
        <SimpleGrid
          cols={3}
          breakpoints={[{ maxWidth: "36rem", cols: 1, spacing: "sm" }]}
        >
          {roasts.map((tr) => (
            <Button key={tr.url} variant="light" color="red">
              <Text className={classes.textAlign}>
                <Link href={`https://${tr.url}`}>{tr.url}</Link>
              </Text>
            </Button>
          ))}
        </SimpleGrid>
      </Container>
    </Container>
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

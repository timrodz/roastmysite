import { Dots } from "@/components/LandingDots";
import SEO from "@/components/SEO";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Grid,
  Group,
  Input,
  List,
  Paper,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  TypographyStylesProvider,
  createStyles,
  rem,
} from "@mantine/core";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconLink,
  IconSearch,
} from "@tabler/icons-react";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    paddingTop: rem(100),
    paddingBottom: rem(80),

    [theme.fn.smallerThan("sm")]: {
      paddingTop: rem(80),
      paddingBottom: rem(60),
    },
  },

  inner: {
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

  dotsLeft: {
    left: 0,
    top: 0,
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
      fontSize: rem(28),
      textAlign: "left",
    },
  },

  highlight: {
    color: theme.colors.green[8],
  },

  description: {
    textAlign: "center",

    [theme.fn.smallerThan("xs")]: {
      textAlign: "left",
      fontSize: theme.fontSizes.md,
    },
  },

  controls: {
    marginTop: theme.spacing.md,
    display: "flex",
    justifyContent: "center",

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  control: {
    "&:not(:first-of-type)": {
      marginLeft: theme.spacing.md,
    },

    [theme.fn.smallerThan("xs")]: {
      height: rem(42),
      fontSize: theme.fontSizes.md,

      "&:not(:first-of-type)": {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },

  // Posting
  comment: {
    padding: `${theme.spacing.md} ${theme.spacing.md}`,
  },

  commentBody: {
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.xs,
  },

  commentContent: {
    "& > p:last-child": {
      marginBottom: 0,
    },

    img: {
      borderRadius: rem(5),
      marginBottom: "0 !important",
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

export default function Home() {
  const { classes, theme } = useStyles();
  const session = useSession();
  const supabase = useSupabaseClient();

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
        <Container className={classes.wrapper} size="lg">
          <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
          <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
          <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
          <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

          <div className={classes.inner}>
            <Title className={classes.title}>
              Convert visitors into{" "}
              <Text component="span" color="green" inherit>
                paying customers
              </Text>
            </Title>

            <Container p={0} size={600}>
              <Text
                size="lg"
                color="dimmed"
                // color={theme.colors.gray[6]}
                className={classes.description}
              >
                Improve your landing page with honest feedback from the indie
                and{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://twitter.com/search?q=%23buildinpublic"
                >
                  #buildinpublic
                </a>{" "}
                communities. Submit your roasts and get roasted
              </Text>
            </Container>

            <Container mt="xl" size="xs">
              <Title order={2} mb="xs" align="center" fz={rem(25)}>
                Find the website you want to roast ↓
              </Title>
              <Container size={400}>
                <TextInput
                  type="url"
                  icon={<IconLink size="1.1rem" stroke={1.5} />}
                  radius="xl"
                  size="md"
                  placeholder="Website URL (example: https://twitter.com)"
                />
              </Container>
            </Container>

            <div className={classes.controls}>
              <Button
                className={classes.control}
                size="lg"
                variant="default"
                color="gray"
              >
                See roasts
              </Button>
              <Button className={classes.control} size="lg">
                Start roasting
              </Button>
            </div>
          </div>
        </Container>
        {/* Comments */}
        <Container size="sm" mt={10} mb={100}>
          <Grid grow gutter="md">
            <Comment
              image="landing/ted.webp"
              name="Ted"
              postedAt="08/05/2023"
              body="This has to be one of the best landing pages I've ever seen! Attaboy, I'm proud of you.<br/><br/>Don't give up now, I know you're going to kick ass!<br/><br/><image src='landing/win.jpg' />"
            />
            <Comment
              image="landing/roy.webp"
              name="Roy"
              postedAt="23/05/2023"
              body={
                "There are no visuals, therefore no emotional connection. I also found styling issues you might want to check, as it comes off as unprofessional.<br/><br/>Another thing I will add: Some grammar usage is incorrect, and comes off as written by a robot.<br/><br/>Good usage of the design tool though."
              }
            />
            <Comment
              image="landing/nathan.webp"
              name="Nate"
              postedAt="01/06/2023"
              body={
                "To be honest, I think you can do better.<br/><br/>The copy isn't there yet, and I don't feel engaged enough. It's very hard to tell what your product does, and how I can benefit from using it.<br/><br/>The whole world is yours. Think greener pastures, like this football field!<br/><br/><img src='landing/football.jpg' />"
              }
            />
          </Grid>
        </Container>
      </main>
    </>
  );
}

const Comment = (props: {
  image: string;
  name: string;
  postedAt: string;
  body: string;
}) => {
  const { classes } = useStyles();
  return (
    <Grid.Col span={3}>
      <Paper withBorder radius="md" className={classes.comment}>
        <Group>
          <Avatar src={props.image} alt={props.name} radius="xl" />
          <Text fz="sm">{props.name}</Text>
          <Box>
            <Text fz="xs" c="dimmed">
              {props.postedAt}
            </Text>
          </Box>
        </Group>
        <Box maw={600}>
          <TypographyStylesProvider className={classes.commentBody}>
            <div
              className={classes.commentContent}
              dangerouslySetInnerHTML={{ __html: props.body }}
            />
          </TypographyStylesProvider>
        </Box>
      </Paper>
    </Grid.Col>
  );
};

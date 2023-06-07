import { Container, Group, Text, createStyles, rem } from "@mantine/core";
import Link from "next/link";
import Logo from "./Logo";

const useStyles = createStyles((theme) => ({
  footer: {
    // Test: Set to 'auto' so it's pushed to the bottom of the page
    marginTop: "auto",
    borderTop: `${rem(1)} solid ${theme.colors.gray[2]}`,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  link: {
    fontSize: rem(17),

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(15),
    },
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      marginTop: theme.spacing.xs,
    },
  },

  builtBy: {
    [theme.fn.smallerThan("xs")]: {
      marginTop: theme.spacing.xs,
    },
  },
}));

interface Links {
  link: string;
  label: string;
}

const links: Links[] = [{ link: "/search", label: "Top Roasts" }];

export default function Footer() {
  const { classes } = useStyles();

  const renderedLinks = links.map((link) => (
    <Link key={link.label} href={link.link} className={classes.link}>
      {link.label}
    </Link>
  ));

  return (
    <footer className={classes.footer}>
      <Container size="lg" className={classes.inner}>
        <Logo size="sm" />
        <Link
          className={classes.builtBy}
          href="https://twitter.com/timrodz"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Text fz="sm" c="dimmed">
            Built by @timrodz
          </Text>
        </Link>
        <Group className={classes.links}>{renderedLinks}</Group>
      </Container>
    </footer>
  );
}

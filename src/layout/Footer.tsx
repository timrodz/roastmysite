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
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color: theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.colors.gray[0],
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

const links: Links[] = [
  // { link: "/pricing", label: "Pricing" },
  // { link: "/faq", label: "FAQ" },
  { link: "https://twitter.com/timrodz", label: "Built by @timrodz" },
];

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
        {/* <Link className={classes.builtBy} href="https://twitter.com/timrodz">
          <Text fz="sm" c="dimmed">
            Built by @timrodz
          </Text>
        </Link> */}
        <Group className={classes.links}>{renderedLinks}</Group>
      </Container>
    </footer>
  );
}
import {
  Burger,
  Button,
  Container,
  Group,
  Header,
  Paper,
  Transition,
  createStyles,
  rem,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useSession } from "@supabase/auth-helpers-react";
import Link from "next/link";
import Logo from "./Logo";

const HEADER_HEIGHT = rem(60);

export const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  link: {
    fontSize: rem(17),

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(15),
    },
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingLeft: rem(10),
    overflow: "hidden",
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,

    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },
}));

export default function Navbar() {
  const session = useSession();
  const { classes } = useStyles();
  const [opened, { toggle, close }] = useDisclosure(false);
  const matches = useMediaQuery("(max-width: 36em)");

  function renderLinks() {
    return (
      <>
        <Link className={classes.link} href="/search" onClick={close}>
          Top roasts
        </Link>
        <Button
          className={classes.link}
          component="a"
          href="/login"
          variant="light"
          onClick={close}
        >
          {session ? "Account" : "Get started"}
        </Button>
      </>
    );
  }

  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container size="md" className={classes.header}>
        <Logo />
        {!matches ? (
          <Group>{renderLinks()}</Group>
        ) : (
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
          />
        )}
      </Container>
      <Transition transition="pop-top-right" duration={120} mounted={opened}>
        {(styles) => (
          <Group className={classes.dropdown} style={styles}>
            {renderLinks()}
          </Group>
        )}
      </Transition>
    </Header>
  );
}

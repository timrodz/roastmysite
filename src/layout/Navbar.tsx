import {
  Button,
  Container,
  Group,
  Header,
  createStyles,
  rem,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
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
}));

export default function Navbar() {
  const session = useSession();
  const { classes, theme } = useStyles();
  const matches = useMediaQuery("(max-width: 36em)");

  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container size="md" className={classes.header}>
        <Logo />
        <Group>
          <Link className={classes.link} href="/search">
            Top roasts
          </Link>
          {session ? (
            <Button
              compact={matches}
              className={classes.link}
              component="a"
              href="/account"
              variant="light"
            >
              Account
            </Button>
          ) : (
            <Button
              className={classes.link}
              component="a"
              href="/login"
              variant="light"
            >
              Get started
            </Button>
          )}
        </Group>
      </Container>
    </Header>
  );
}

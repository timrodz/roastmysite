import {
  Button,
  Center,
  Container,
  Flex,
  Group,
  Header,
  List,
  Text,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import Link from "next/link";

const HEADER_HEIGHT = rem(60);

export const useHeaderStyles = createStyles((theme) => ({
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

  links: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
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

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

export default function Navbar() {
  const { classes } = useHeaderStyles();
  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container size="md" className={classes.header}>
        <Title fz={{ base: rem(18), sm: rem(25) }}>Roast My Site 🔥</Title>
        <Group>
          <Link href="/roast-page">
            <Button variant="filled">Start roasting</Button>
          </Link>
        </Group>
      </Container>
    </Header>
  );
}

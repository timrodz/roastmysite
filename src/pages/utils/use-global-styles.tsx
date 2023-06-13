import { createStyles, rem } from "@mantine/core";

export const useGlobalStyles = createStyles((theme) => ({
  pageWrapper: {
    position: "relative",
    zIndex: 0,
    paddingBottom: rem(60),
    paddingTop: rem(90),

    [theme.fn.smallerThan("sm")]: {
      paddingTop: rem(50),
    },
  },

  textAlign: {
    textAlign: "center",
    [theme.fn.smallerThan("xs")]: {
      textAlign: "left",
    },
  },

  linkPrimary: {
    color: theme.colors.indigo,
  },

  linkSecondary: {
    color: theme.colors.orange,
  },

  highlightOrange: {
    position: "relative",
    backgroundColor: theme.colors.orange[1],
    borderRadius: theme.radius.sm,
    padding: `${rem(4)} ${rem(12)} ${rem(6)} ${rem(12)}`,
  },

  highlightGreen: {
    position: "relative",
    backgroundColor: theme.colors.green[0],
    borderRadius: theme.radius.sm,
    padding: `${rem(4)} ${rem(8)} ${rem(6)} ${rem(8)}`,
  },
}));

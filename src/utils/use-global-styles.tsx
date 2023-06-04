import { createStyles, rem } from "@mantine/core";

export const useGlobalStyles = createStyles((theme) => ({
  pageWrapper: {
    position: "relative",
    zIndex: 1,
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
    color: theme.primaryColor,
  },
}));

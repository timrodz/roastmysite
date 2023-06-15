import metadata from "@/lib/metadata";
import { useGlobalStyles } from "@utils/use-global-styles";
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  List,
  Text,
  Title,
  createStyles,
  rem,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  pricingWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: rem(20),

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
    },
  },

  cardSmall: {
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,

    width: rem(300),

    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },

  cardLimited: {
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,

    width: rem(450),

    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },
}));

export default function FAQ() {
  const { classes } = useStyles();
  const { classes: globalStyles } = useGlobalStyles();

  return (
    <>
      <Title
        order={3}
        fw={800}
        fz={{ base: 26, sm: 36 }}
        mb="sm"
        className={globalStyles.textAlign}
      >
        Frequently Asked Questions
      </Title>
      <Container size={600} p={0} mb="xl">
        <Text>oiajsodiajsd</Text>
      </Container>
    </>
  );
}

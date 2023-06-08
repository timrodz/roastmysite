import { useGlobalStyles } from "@/utils/use-global-styles";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  List,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import { useRouter } from "next/router";

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

export default function Pricing() {
  const { classes } = useStyles();
  const { classes: globalStyles } = useGlobalStyles();

  return (
    <section id="top-roasts" className="mb-12">
      <Title
        order={3}
        fw={800}
        fz={{ base: 26, sm: 36 }}
        mb="sm"
        className={globalStyles.textAlign}
      >
        You can roast for free
      </Title>
      <Container size={600} p={0} mb="xl">
        <Text
          fz={{ base: 18, sm: 20 }}
          color="dimmed"
          className={globalStyles.textAlign}
        >
          Unlock these smoking-hot features with this{" "}
          <strong>lifetime deal</strong>!
        </Text>
      </Container>
      <Container p={0} mx="auto">
        <div className={classes.pricingWrapper}>
          {/* Free */}
          <Card
            shadow="md"
            radius="md"
            className={classes.cardSmall}
            padding="xl"
          >
            <Text fw={600} fz={20} mb="md">
              Beginner Roaster
            </Text>
            <Text fw={800} fz={40}>
              $0
            </Text>
            <List mt="xs" mb="xl" spacing={10}>
              <List.Item>
                <Text component="span" c="yellow">
                  ✦
                </Text>{" "}
                Roast any number of websites
              </List.Item>
              <List.Item>
                <Text component="span" c="yellow">
                  ✦
                </Text>{" "}
                See up to 3 roasts per page
              </List.Item>
            </List>
            <Button component="a" href="/login" variant="outline">
              Get started for free
            </Button>
          </Card>
          <Card
            shadow="md"
            radius="md"
            className={classes.cardLimited}
            padding="xl"
          >
            <Text fw={600} fz={24} mb="md">
              Veteran Roaster
            </Text>
            <Text fw={800} fz={30} mb="lg">
              <Group spacing={8}>
                <span className="line-through">$39</span> $17 USD{" "}
                <Badge color="orange" variant="filled">
                  Lifetime deal
                </Badge>
              </Group>
            </Text>
            <Text>Everything in BBQ enthusiast plus:</Text>
            <List mt="xs" mb="xl" spacing={10}>
              <List.Item>
                <Text component="span" c="yellow">
                  ✦
                </Text>{" "}
                Unlimited roasting
              </List.Item>
              <List.Item>
                <Text component="span" c="yellow">
                  ✦
                </Text>{" "}
                SEO improvements powered by AI
              </List.Item>
              <List.Item>
                <Text component="span" c="yellow">
                  ✦
                </Text>{" "}
                Claim website ownership{" "}
                <Badge color="yellow">coming soon</Badge>
              </List.Item>
              <List.Item>
                <Text component="span" c="yellow">
                  ✦
                </Text>{" "}
                Google Chrome Extension{" "}
                <Badge color="yellow">coming soon</Badge>
              </List.Item>
            </List>
            <Button
              component="a"
              href="https://roastmysite.lemonsqueezy.com/checkout/buy/0c26096a-1be4-41ac-a05f-0dbb8addd747?discount=0"
              target="_blank"
              size="lg"
              mb="xs"
            >
              Get started
            </Button>
            <Text size="sm" color="dimmed">
              One-time payment — Powered by Lemonsqueezy
            </Text>
          </Card>
        </div>
      </Container>
    </section>
  );
}

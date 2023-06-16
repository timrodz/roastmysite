import metadata, { CONSTANTS } from "@/lib/metadata";
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
import { IconFlame } from "@tabler/icons-react";
import Link from "next/link";

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
    border: `${rem(1)} solid ${theme.colors.gray[3]}`,

    width: rem(300),

    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },

  cardLimited: {
    border: `${rem(1)} solid ${theme.colors.gray[3]}`,

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
      <Container size={600} p={0} mb={50}>
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
          <Card radius="md" className={classes.cardSmall} padding="xl">
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
                See up to {CONSTANTS.MAX_ROASTS_FREE_USER} roasts per page
              </List.Item>
            </List>
            <Button
              component="a"
              href="/login"
              rel="canonical"
              variant="outline"
              aria-label="Get started for free"
            >
              Get started for free
            </Button>
          </Card>
          <Card radius="md" className={classes.cardLimited} padding="xl">
            <Text fw={600} fz={24} mb="md">
              Lifetime Roaster
            </Text>
            <Text fw={800} fz={30} mb="lg">
              <Group spacing={8}>
                <span className="line-through">$39</span>{" "}
                {metadata.lifetimeDeal.priceLabel} USD{" "}
                <Badge color="orange" variant="filled" size="lg" my="auto">
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
              target="_blank"
              href={metadata.lifetimeDeal.checkoutLink}
              size="lg"
              mb="xs"
              leftIcon={<IconFlame />}
              aria-label="Start roasting now"
            >
              Start roasting now
            </Button>
            <Text size="sm" color="dimmed">
              One-time payment — Powered by{" "}
              <Link
                target="blank"
                rel="noopener noreferrer"
                href="https://www.lemonsqueezy.com/"
              >
                Lemonsqueezy
              </Link>
            </Text>
          </Card>
        </div>
      </Container>
    </section>
  );
}

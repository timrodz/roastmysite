import { useGlobalStyles } from "@/utils/use-global-styles";
import { Button, Container, SimpleGrid, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";

interface Roast {
  url: string;
  count: number;
}

interface Props {
  title: string;
  roasts: Roast[];
}

export default function TopRoasts({ title, roasts }: Props) {
  const router = useRouter();
  const { classes } = useGlobalStyles();

  const sortedRoasts = roasts
    .sort((a, b) => b.count - a.count)
    .map((roast) => (
      <Button
        mih={"8vw"}
        key={roast.url}
        variant="light"
        color="orange"
        onClick={(e) => {
          e.preventDefault();
          router.push(`/${roast.url}`);
        }}
      >
        {roast.url}
      </Button>
    ));

  return (
    <>
      <Title
        order={3}
        fw={800}
        fz={{ base: 26, sm: 36 }}
        mb="sm"
        className={classes.textAlign}
      >
        {title}
      </Title>
      <Text
        mb="xl"
        fz={{ base: 18, sm: 22 }}
        color="dimmed"
        className={classes.textAlign}
      >
        These websites are getting the most roasts out there! See for yourself
      </Text>
      <Container p={0}>
        <SimpleGrid
          cols={3}
          breakpoints={[{ maxWidth: "36rem", cols: 1, spacing: "sm" }]}
        >
          {sortedRoasts}
        </SimpleGrid>
      </Container>
    </>
  );
}

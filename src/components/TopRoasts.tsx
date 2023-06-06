import { useGlobalStyles } from "@/utils/use-global-styles";
import { Button, Container, SimpleGrid, Title } from "@mantine/core";
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
    <section id="top-roasts" className="mb-12">
      <Title
        order={3}
        fz={{ base: 26, sm: 32 }}
        mb="xl"
        className={classes.textAlign}
      >
        {title}
      </Title>
      <Container p={0}>
        <SimpleGrid
          cols={3}
          breakpoints={[{ maxWidth: "36rem", cols: 1, spacing: "sm" }]}
        >
          {sortedRoasts}
        </SimpleGrid>
      </Container>
    </section>
  );
}

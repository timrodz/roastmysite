import { supabaseClient } from "@lib/supabase";
import { Button, Container, SimpleGrid, Text, Title } from "@mantine/core";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useGlobalStyles } from "@utils/use-global-styles";
import { useEffect, useState } from "react";

interface Roast {
  url: string;
  count: number;
}

interface Props {
  title: string;
}

export default function TopRoasts({ title }: Props) {
  const { classes } = useGlobalStyles();
  const [roasts, roastsSet] = useState<Roast[]>([]);

  const { data, error, isLoading } = useQuery(
    supabaseClient
      .from("websites")
      .select("url, roast_count")
      .order("roast_count", { ascending: false })
      .limit(6)
  );

  useEffect(() => {
    if (!data) {
      return;
    }

    roastsSet(
      data?.filter(Boolean).map((site) => ({
        url: site.url,
        count: site.roast_count as number,
      })) || []
    );
  }, [data]);

  if (isLoading || error || !data) {
    return null;
  }

  const sortedRoasts = roasts
    .sort((a, b) => b.count - a.count)
    .map((roast) => (
      <Button
        component="a"
        href={`/view/${roast.url}`}
        rel="canonical"
        mih={"8vw"}
        key={roast.url}
        variant="light"
        color="orange"
        aria-label={`Navigate to ${roast.url}`}
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
        mb={50}
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

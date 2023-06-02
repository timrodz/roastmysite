import Roast from "@/components/Roast";
import SEO from "@/components/SEO";
import { Database } from "@lib/database.types";
import { supabase } from "@lib/supabase";
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Text,
  Title,
  createStyles,
} from "@mantine/core";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
type Site = Database["public"]["Tables"]["site"]["Row"];
type Roast = Database["public"]["Tables"]["roast"]["Row"];

const useStyles = createStyles((theme) => ({
  link: {
    color: theme.colors.indigo,
  },
}));

type Props = {
  site: string;
  roasts?: Roast[];
};

function Page({ site, roasts }: Props) {
  const { classes } = useStyles();

  const hasRoasts = roasts ? roasts.length > 0 : false;

  const renderRoasts = roasts?.map((r) => {
    return (
      <Roast
        key={r.id}
        username={r.site_id.toString()}
        postedAt={new Date(r.created_at!)}
        content={r.content}
      />
    );
  });
  /**
   * 1. Find site entry in DB
   * 2. Find roasts assigned to site
   * 3. If no roasts, custom messaging to show user they're the first roast
   */
  return (
    <>
      {/* <SEO /> */}
      <main>
        <Container mt={100} size="sm">
          <Stack spacing={10}>
            {hasRoasts ? (
              <>
                <Title>
                  Roasts for{" "}
                  <Link
                    target="_blank"
                    className={classes.link}
                    href={`https://${site}`}
                  >
                    {site}
                  </Link>
                </Title>
                <Stack mt={30}>{renderRoasts}</Stack>
              </>
            ) : (
              <>
                <Title mb="xs">
                  There are no roasts for{" "}
                  <Link
                    target="_blank"
                    className={classes.link}
                    href={`https://${site}`}
                  >
                    {site}
                  </Link>{" "}
                  yet
                </Title>
                <Text mb="sm" size="lg">
                  But you can be the first to roast them!
                </Text>
                <AddRoast />
              </>
            )}
          </Stack>
        </Container>
      </main>
    </>
  );
}

function AddRoast() {
  return (
    <Box>
      <Button>Add roast</Button>
    </Box>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ url: string }>
) {
  const siteUrl = context.params?.url!;
  console.log("server side props", { url: siteUrl });

  let { data: siteData } = await supabase
    .from("site")
    .select("id")
    .eq("url", siteUrl)
    .limit(1);

  if (!siteData?.length) {
    console.warn("No entries for site, therefore no roasts");
    return {
      props: {
        site: siteUrl,
        roasts: [],
      },
    };
  }

  const siteId = siteData?.[0].id;

  console.log({ siteId });

  let { data: roastData } = await supabase
    .from("roast")
    // .select("id, user_id, content")
    .select("*")
    .eq("site_id", siteId);

  const roasts = roastData?.filter(Boolean) as Roast[];

  console.log({ roasts });

  return {
    props: {
      site: siteUrl,
      roasts: roasts,
    },
  };
}

export default Page;

/** TODO: CSS for visited link to remain unchanged */
import Roast from "@/components/Roast";
import { useGlobalStyles } from "@/utils/use-global-styles";
import { Database } from "@lib/database.types";
import { supabaseClient } from "@lib/supabase";
import {
  Box,
  Button,
  Container,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useState } from "react";

type Site = Database["public"]["Tables"]["site"]["Row"];
type Roast = Database["public"]["Tables"]["roast"]["Row"];

interface Props {
  site: { id: number; url: string };
  roasts?: Roast[];
}

const minimumCharactersForRoast = 30;

export default function RoastUrl({ site, roasts }: Props) {
  const { classes } = useGlobalStyles();

  const [roastContent, roastContentSet] = useState("");

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
        <Container className={classes.pageWrapper}>
          <section id="title" className="mb-8">
            {hasRoasts ? (
              <>
                <Title fz={{ base: 32, sm: 40 }} className={classes.textAlign}>
                  Roasts for{" "}
                  <Link
                    target="_blank"
                    className={classes.linkPrimary}
                    href={`https://${site}`}
                  >
                    {site.url}
                  </Link>
                </Title>
                <Stack mt={30}>{renderRoasts}</Stack>
              </>
            ) : (
              <>
                <Title
                  mb="xs"
                  fz={{ base: 32, sm: 40 }}
                  className={classes.textAlign}
                >
                  There are no roasts for{" "}
                  <Link
                    target="_blank"
                    className={classes.linkPrimary}
                    href={`https://${site.url}`}
                  >
                    {site.url}
                  </Link>{" "}
                  yet
                </Title>
                <Text size="lg" mb="sm" className={classes.textAlign}>
                  But you can be the first to roast them!
                </Text>
              </>
            )}
          </section>
          <section id="add-roast">
            <Container p={0} size="xs">
              <Textarea
                label="Add your own roast"
                minRows={3}
                autosize
                value={roastContent}
                onChange={(e) => roastContentSet(e.target.value)}
              />
              <Text mb="xs" size="xs" color="dimmed">
                {roastContent.length < minimumCharactersForRoast
                  ? `Roasts require a minimum of ${minimumCharactersForRoast} characters. ${roastContent.length}/${minimumCharactersForRoast}`
                  : "Good to go!"}
              </Text>
              {/* TODO: Replace TextArea for mantine rich text editor (tiptap) */}
              <AddRoast siteId={site.id} content={roastContent} />
            </Container>
          </section>
        </Container>
      </main>
    </>
  );
}

function AddRoast({ content, siteId }: { siteId: number; content: string }) {
  const onClick = async (e) => {
    e.preventDefault();

    // Sanity check for text RIP
    // Text over 30 characters long?
    if (!content || content.length < 30) {
      console.warn("No content, can't submit roast");
      return;
    }

    // TODO: DB operation
    await supabaseClient.from("roast").insert({ content, site_id: siteId });
  };

  return (
    <Box>
      <Button onClick={onClick}>Submit roast</Button>
    </Box>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ url: string }>
) {
  const supabase = createPagesServerClient(context);
  const siteUrl = context.params?.url!;
  console.log("server side props", { url: siteUrl });

  let { data: siteData } = await supabase
    .from("site")
    .select("id")
    .eq("url", siteUrl)
    .limit(1);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log({ session });

  if (!siteData?.length) {
    console.warn("No entries for site, therefore no roasts");
    return {
      props: {
        site: siteUrl,
        roasts: [],
      },
    };
  }

  const [site] = siteData;

  console.log({ siteId: site.id });

  let { data: roastData } = await supabaseClient
    .from("roast")
    // .select("id, user_id, content")
    .select("*")
    .eq("site_id", site.id);

  const roasts = roastData?.filter(Boolean) as Roast[];

  console.log({ roasts });

  return {
    props: {
      site: {
        id: site.id,
        url: siteUrl,
      },
      roasts: roasts,
    },
  };
}

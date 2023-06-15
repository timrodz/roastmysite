/**
 * NOT LOADING AVATARS YET
 */
import { SessionUser } from "@lib/supabase";
import { useGlobalStyles } from "@utils/use-global-styles";
import { Button, Container, Group, Text, Title } from "@mantine/core";
import Link from "next/link";

interface Props {
  siteId?: number;
  siteUrl: string;
  sessionUser: SessionUser;
}

export default function WebsiteActionPanel({
  siteId,
  siteUrl,
  sessionUser,
}: Props) {
  const { classes, theme } = useGlobalStyles();

  // Hack, for now I own my own website
  const isOwner =
    siteUrl === "roastmysite.io" &&
    sessionUser?.id === "a4f63dd4-ce57-4038-83ae-b7f436928117";

  return (
    <>
      <Title fz={{ base: 20, sm: 24 }} mb="xs">
        Actions
      </Title>
      {isOwner && (
        <Text fz={{ base: 14, sm: 16 }} mb="xs">
          Ownership claimed by{" "}
          <Link
            href="https://twitter.com/timrodz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={classes.highlightGreen}>@timrodz</span>
          </Link>
        </Text>
      )}
      <Group spacing={10}>
        <Button
          color="green"
          component="a"
          href={`/view/${siteUrl}/seo`}
          aria-label="Scan website for SEO improvements"
        >
          Scan website SEO improvements (WIP)
        </Button>
        {!isOwner && (
          <Button
            color="green"
            disabled
            aria-label="Claim website ownerhsip (coming soon)"
          >
            Claim website ownerhsip (coming soon)
          </Button>
        )}
      </Group>
    </>
  );
}

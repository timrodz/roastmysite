/**
 * NOT LOADING AVATARS YET
 */
import { useGlobalStyles } from "@/utils/use-global-styles";
import { Button, Container, Group, Text, Title } from "@mantine/core";
import Link from "next/link";

type Site = { id: number; url: string };
interface Props {
  site: Site;
  browsingUserId: string | null;
}

export default function WebsiteActionPanel({ site, browsingUserId }: Props) {
  const { classes, theme } = useGlobalStyles();

  // Hack, for now I own my own website
  const isOwner =
    site.url === "roastmysite.io" &&
    browsingUserId === "a4f63dd4-ce57-4038-83ae-b7f436928117";

  return (
    <Container p={0} size="xs">
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
        <Button color="green" component="a" href={`/${site.url}/seo`}>
          Scan website SEO improvements
        </Button>
        {!isOwner && (
          <Button color="green" disabled>
            Claim website ownerhsip (coming soon)
          </Button>
        )}
      </Group>
    </Container>
  );
}

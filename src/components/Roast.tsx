/**
 * NOT LOADING AVATARS YET
 */
import { Database } from "@/lib/database.types";
import { Profile } from "@/lib/supabase";
import {
  Badge,
  Box,
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  Text,
  ThemeIcon,
  TypographyStylesProvider,
  createStyles,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { IconBrandTwitter, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  comment: {
    padding: `${theme.spacing.md} ${theme.spacing.md}`,
  },

  commentBody: {
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.xs,
  },

  commentContent: {
    fontSize: rem(16),

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(14),
    },

    "& > p:last-child": {
      marginBottom: 0,
    },

    h1: {
      marginTop: 0,
    },

    p: {
      marginBottom: theme.spacing.xs,

      img: {
        borderRadius: rem(5),
        marginBottom: "0 !important",
      },
    },

    img: {
      borderRadius: rem(5),
      marginBottom: "0 !important",
    },
  },
}));

interface Props {
  id: number;
  browsingUserId: string | null;
  author?: Profile;
  postedAt: Date;
  content: string;
}

export default function Roast({
  id: roastId,
  browsingUserId,
  author,
  postedAt,
  content,
}: Props) {
  const { classes, theme } = useStyles();
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [performingAction, performingActionSet] = useState(false);

  const supabase = useSupabaseClient<Database>();

  const isUserAuthor = browsingUserId === author?.id;

  const formattedDate = dayjs(postedAt).format("YYYY-MM-DD");

  function renderPost(modal?: boolean) {
    return (
      <Box p={modal ? 20 : 0} maw={600}>
        <TypographyStylesProvider className={classes.commentBody}>
          <div
            className={classes.commentContent}
            dangerouslySetInnerHTML={{
              __html: modal ? `${content.slice(0, 220)}...` : content,
            }}
          />
        </TypographyStylesProvider>
      </Box>
    );
  }

  async function onDeleteClick(e: any) {
    console.log("on delete");
    e.preventDefault();

    if (!isUserAuthor) {
      return;
    }

    performingActionSet(true);

    const { error } = await supabase
      .from("roasts")
      .delete()
      .match({ id: roastId, user_id: browsingUserId });

    if (error) {
      console.error(error);
      performingActionSet(false);
      return;
    }

    console.log("success");
    router.reload();
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          console.log("close?");
          if (performingAction) {
            console.log("no");
            return;
          }
          close();
        }}
        title="Do you want to delete this roast?"
        overlayProps={{
          color: theme.colors.gray[3],
          opacity: 0.55,
          blur: 3,
        }}
      >
        <Box pos="relative">
          <LoadingOverlay visible={performingAction} />
          <Text mb="xs">
            This action is <strong>irreversible</strong>. Here&apos;s a preview
            of the post you&apos;re deleting:
          </Text>
          {renderPost(true)}
          <Button
            mt="xl"
            color="red"
            variant="outline"
            leftIcon={<IconTrash />}
            onClick={onDeleteClick}
          >
            Yes, I want to delete this roast
          </Button>
        </Box>
      </Modal>
      <Paper withBorder radius="md" className={classes.comment}>
        <Group spacing={10}>
          {/* {author.avatar && (
          <Avatar src={author.avatar} alt={author.username} radius="xl" />
        )} */}
          <Text fz="lg">By {author?.username}</Text>
          {author?.twitter_profile && (
            <Badge
              leftSection={<IconBrandTwitter size="0.8rem" />}
              color="blue"
            >
              <Link
                href={`https://twitter.com/${author.twitter_profile}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {author.twitter_profile}
              </Link>
            </Badge>
          )}
          {author?.membership_status && (
            <Badge color="orange">
              {author.membership_status === "lifetime" ? "Lifetime" : "Premium"}
            </Badge>
          )}
          <Text fz="xs" c="dimmed">
            Posted on {formattedDate}
          </Text>
          {isUserAuthor && (
            <ThemeIcon
              size="lg"
              color="gray"
              variant="light"
              onClick={open}
              className="hover:cursor-pointer"
            >
              <IconTrash />
            </ThemeIcon>
          )}
        </Group>
        {renderPost()}
      </Paper>
    </>
  );
}

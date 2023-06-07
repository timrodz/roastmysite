/**
 * NOT LOADING AVATARS YET
 */
import {
  Badge,
  Box,
  Group,
  Paper,
  Text,
  TypographyStylesProvider,
  createStyles,
  rem,
} from "@mantine/core";
import { IconBrandTwitter } from "@tabler/icons-react";
import dayjs from "dayjs";
import Link from "next/link";

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
    },

    img: {
      borderRadius: rem(5),
      marginBottom: "0 !important",
    },
  },
}));

interface User {
  username: string;
  avatar?: string;
  twitter?: string;
  lifetime: boolean;
}

interface Props {
  user: User;
  postedAt: Date;
  content: string;
}

export default function Roast({ user, postedAt, content }: Props) {
  const { classes } = useStyles();

  const date = dayjs(postedAt);
  const formatted = date.format("YYYY-MM-DD");

  console.log("content", content);
  console.log({ date, formatted });
  return (
    <Paper withBorder radius="md" className={classes.comment}>
      <Group spacing={10}>
        {/* {user.avatar && (
          <Avatar src={user.avatar} alt={user.username} radius="xl" />
        )} */}
        <Text fz="lg">By {user.username}</Text>
        {user.twitter && (
          <Badge leftSection={<IconBrandTwitter size="0.8rem" />} color="blue">
            <Link
              href={`https://twitter.com/${user.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {user.twitter}
            </Link>
          </Badge>
        )}
        {user.lifetime && <Badge color="orange">Member</Badge>}
        <Text fz="xs" c="dimmed">
          Posted on {formatted}
        </Text>
      </Group>
      <Box maw={600}>
        <TypographyStylesProvider className={classes.commentBody}>
          <div
            className={classes.commentContent}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </TypographyStylesProvider>
      </Box>
    </Paper>
  );
}

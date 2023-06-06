/**
 * NOT LOADING AVATARS YET
 */
import {
  // Avatar,
  Badge,
  Box,
  Group,
  Paper,
  Text,
  TypographyStylesProvider,
  createStyles,
  rem,
} from "@mantine/core";
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
}

interface Props {
  user: User;
  postedAt: Date;
  content: string;
}

export default function Roast({ user, postedAt, content }: Props) {
  const { classes } = useStyles();
  return (
    <Paper withBorder radius="md" className={classes.comment}>
      <Group spacing={10}>
        {/* {user.avatar && (
          <Avatar src={user.avatar} alt={user.username} radius="xl" />
        )} */}
        <Text fz="sm">By {user.username}</Text>
        {user.twitter && (
          <Badge size="sm" color="blue">
            <Link href="/">@{user.twitter}</Link>
          </Badge>
        )}
        <Box>
          <Text fz="xs" c="dimmed">
            {postedAt.toDateString()}
          </Text>
        </Box>
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

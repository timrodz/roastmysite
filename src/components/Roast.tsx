import {
  Avatar,
  Box,
  Group,
  Paper,
  Text,
  TypographyStylesProvider,
  createStyles,
  rem,
} from "@mantine/core";

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

interface Props {
  username: string;
  imageUrl?: string;
  postedAt: Date;
  content: string;
}

export default function Roast({
  username,
  imageUrl: userImageUrl,
  postedAt,
  content,
}: Props) {
  const { classes } = useStyles();
  return (
    <Paper withBorder radius="md" className={classes.comment}>
      <Group>
        <Avatar src={userImageUrl} alt={username} radius="xl" />
        <Text fz="sm">By {username}</Text>
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

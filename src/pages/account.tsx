import SEO from "@components/misc/SEOComponent";
import { Database } from "@lib/database.types";
import { Profile, getUserProfileById as getProfileById } from "@lib/supabase";
import { useGlobalStyles } from "@/pages/utils/use-global-styles";
import {
  Badge,
  Box,
  Button,
  Container,
  Group,
  List,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { IconAt, IconFlame } from "@tabler/icons-react";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import metadata from "@/lib/metadata";

interface Props {
  userId: string;
  email: string;
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<any> {
  const supabase = createPagesServerClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    console.log("!session, redirecting to /login");
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { id, email } = session.user;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery([`${id}_account`], () => getProfileById(id));

  return {
    props: {
      userId: id,
      email,
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default function Account({ userId, email }: Props) {
  const { classes } = useGlobalStyles();
  const router = useRouter();
  const supabase = useSupabaseClient<Database>();

  const [loading, loadingSet] = useState(false);
  const [usernameError, usernameErrorSet] = useState("");
  const [username, usernameSet] = useState<Profile["username"]>("");
  const [twitter, twitterSet] = useState<Profile["twitter_profile"]>("");

  const { data, isLoading } = useQuery({
    queryKey: [`${userId}_account`],
    queryFn: () => getProfileById(userId),
    enabled: false,
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    usernameSet(data.username);
    twitterSet(data.twitter_profile);
  }, [data]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>No data</p>;
  }

  async function updateProfile({
    // avatarUrl,
    username,
    twitterProfile,
  }: {
    // avatarUrl: Profile["avatar_url"];
    username: Profile["username"];
    twitterProfile: Profile["twitter_profile"];
  }) {
    if (!userId) {
      return;
    }
    try {
      loadingSet(true);
      if (!userId) throw new Error("No user");
      if (!username) throw new Error("No username provided");

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          username: username.slice(0, 20),
          twitter_profile: twitterProfile?.slice(0, 20),
          // avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        throw error;
      }

      alert("Profile updated!");
    } catch (error: any) {
      if (error.code && error.code === "23505") {
        usernameErrorSet("That username has already been taken.");
      }
      if (error.message === "No username provided") {
        usernameErrorSet("Please write an username.");
      } else {
        alert("Error updating your profile!");
        console.log(error);
      }
    } finally {
      loadingSet(false);
    }
  }

  function renderMembershipStatus() {
    if (!data) {
      return null;
    }
    switch (data.membership_status) {
      case "lifetime":
        return (
          <Badge
            size="xl"
            mih="5vh"
            radius="sm"
            color="orange"
            leftSection={<IconFlame />}
            variant="filled"
          >
            Lifetime membership
          </Badge>
        );
      case "subscribed":
        return (
          <Badge
            size="xl"
            mih="5vh"
            radius="sm"
            color="green"
            leftSection={<IconFlame />}
            variant="filled"
          >
            Subscribed
          </Badge>
        );
      default:
        return <LifetimeDeal />;
    }
  }

  return (
    <>
      <SEO title="Account page" description="See and edit your account" />
      <main>
        <Container size="xs" className={classes.pageWrapper}>
          <Box pos="relative">
            <LoadingOverlay visible={loading} />
            <Stack spacing="md">
              <TextInput size="lg" label="E-mail" value={email} disabled />
              <TextInput
                required
                minLength={3}
                maxLength={20}
                size="lg"
                label="Username"
                value={username || ""}
                onChange={(e) => {
                  usernameErrorSet("");
                  usernameSet(e.target.value);
                }}
                error={usernameError}
              />
              <TextInput
                size="lg"
                label="Twitter Profile"
                icon={<IconAt size="1.1rem" stroke={1.5} color="black" />}
                value={twitter || ""}
                onChange={(e) => twitterSet(e.target.value)}
              />
              <Text size="sm" color="dimmed">
                By the way, avatars coming soon!
              </Text>
            </Stack>

            <Group mt="xl" mb="xl">
              <Button
                size="lg"
                className="button primary block"
                variant="outline"
                onClick={() =>
                  updateProfile({
                    username,
                    twitterProfile: twitter,
                    // avatarUrl: null,
                  })
                }
              >
                Update profile
              </Button>

              <Button
                size="lg"
                variant="outline"
                color="red"
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/login");
                }}
              >
                Sign Out
              </Button>
            </Group>
            {renderMembershipStatus()}
          </Box>
        </Container>
      </main>
    </>
  );
}

function LifetimeDeal() {
  return (
    <>
      <Text fw={800} fz={25} mt={60} mb="lg">
        <Group spacing={8}>
          Upgrade for <span className="line-through">$39</span>{" "}
          {metadata.lifetimeDeal.priceLabel} USD{" "}
          <Badge color="orange" variant="filled">
            Lifetime deal
          </Badge>
        </Group>
      </Text>
      <List mt="xs" mb="xl" spacing={10}>
        <List.Item>
          <Text component="span" c="yellow">
            ✦
          </Text>{" "}
          Roast any website, and see all of their roasts
        </List.Item>
        <List.Item>
          <Text component="span" c="yellow">
            ✦
          </Text>{" "}
          Claim website ownership and post updates on your roast page{" "}
          <Badge color="yellow">coming soon</Badge>
        </List.Item>
        <List.Item>
          <Text component="span" c="yellow">
            ✦
          </Text>{" "}
          Google Chrome Extension <Badge color="yellow">coming soon</Badge>
        </List.Item>
      </List>
      <Button
        component="a"
        target="_blank"
        href={metadata.lifetimeDeal.checkoutLink}
        size="lg"
        mb="xs"
      >
        Upgrade
      </Button>
      <Text size="sm" color="dimmed">
        One-time payment — Powered by Lemonsqueezy
      </Text>
    </>
  );
}

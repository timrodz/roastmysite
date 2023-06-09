import Avatar from "@/components/account/Avatar";
import SEO from "@/components/misc/SEO";
import { Database } from "@/lib/database.types";
import { MembershipStatus, Profile } from "@/lib/supabase";
import { useGlobalStyles } from "@/utils/use-global-styles";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  List,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { User, createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { IconAt, IconFlame, IconKey } from "@tabler/icons-react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Account({ user, email }: Props) {
  const { classes } = useGlobalStyles();
  const router = useRouter();

  const supabase = useSupabaseClient<Database>();
  const [username, usernameSet] = useState<Profile["username"]>(user.username);
  const [twitter, twitterSet] = useState<Profile["twitter_profile"]>(
    user.twitter_profile
  );

  const [loading, loadingSet] = useState(false);
  const [usernameError, usernameErrorSet] = useState("");

  async function updateProfile({
    // avatarUrl,
    username,
    twitterProfile,
  }: {
    // avatarUrl: Profile["avatar_url"];
    username: Profile["username"];
    twitterProfile: Profile["twitter_profile"];
  }) {
    if (!user.id) {
      return;
    }
    console.log("update", { user });
    try {
      loadingSet(true);
      if (!user) throw new Error("No user");
      if (!username) throw new Error("No username provided");

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          username,
          twitter_profile: twitterProfile,
          // avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

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
    switch (user.membership_status) {
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
                disabled={!user}
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
          Upgrade for <span className="line-through">$39</span> $17 USD{" "}
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
        href="https://roastmysite.lemonsqueezy.com/checkout/buy/0c26096a-1be4-41ac-a05f-0dbb8addd747?discount=0"
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

interface Props {
  user: Profile;
  email: string;
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<{ props: Props } | { redirect: any }> {
  // TODO: cookies
  // Create authenticated Supabase Client
  const supabase = createPagesServerClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, twitter_profile, membership_status")
    .eq("id", session.user.id)
    .single();

  if (error || !data) {
    console.error(error);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: data as Profile,
      email: session.user.email || "unknown",
    },
  };
}

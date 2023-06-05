import SEO from "@/components/SEO";
import { Database } from "@/lib/database.types";
import { useGlobalStyles } from "@/utils/use-global-styles";
import {
  Button,
  Container,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { User, createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { IconAt } from "@tabler/icons-react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function Account({ user }: { user: User }) {
  const { classes } = useGlobalStyles();
  const router = useRouter();
  const supabase = useSupabaseClient<Database>();
  const [loading, setLoading] = useState(true);
  const [username, usernameSet] = useState<Profiles["username"]>(null);
  const [twitterProfile, twitterProfileSet] =
    useState<Profiles["twitter_profile"]>(null);
  const [avatarUrl, avatarUrlSet] = useState<Profiles["avatar_url"]>(null);

  const [usernameError, usernameErrorSet] = useState("");

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      setLoading(true);
      if (!user) throw new Error("No user");

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, twitter_profile, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        usernameSet(data.username);
        twitterProfileSet(data.twitter_profile);
        avatarUrlSet(data.avatar_url);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    twitterProfile,
    avatarUrl,
  }: {
    username: Profiles["username"];
    twitterProfile: Profiles["twitter_profile"];
    avatarUrl: Profiles["avatar_url"];
  }) {
    try {
      setLoading(true);
      if (!user) throw new Error("No user");
      if (!username) throw new Error("No username provided");

      const updates = {
        id: user.id,
        username,
        twitter_profile: twitterProfile,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;
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
      setLoading(false);
    }
  }

  return (
    <>
      <SEO title="Profile page" description="See and edit your profile" />
      <main>
        <Container size="xs" className={classes.pageWrapper}>
          <Stack spacing="md">
            <TextInput size="lg" label="E-mail" value={user.email} disabled />
            <TextInput
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
              value={twitterProfile || ""}
              onChange={(e) => twitterProfileSet(e.target.value)}
            />
          </Stack>

          <Group mt="xl">
            {loading ? (
              <Text>Loading...</Text>
            ) : (
              <>
                <Button
                  size="lg"
                  className="button primary block"
                  onClick={() =>
                    updateProfile({
                      username,
                      twitterProfile: twitterProfile,
                      avatarUrl: avatarUrl,
                    })
                  }
                  disabled={loading}
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
              </>
            )}
          </Group>
        </Container>
      </main>
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
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

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};

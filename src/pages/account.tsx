import SEO from "@/components/SEO";
import { Database } from "@/lib/database.types";
import {
  Button,
  Container,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { User, createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { IconAt } from "@tabler/icons-react";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function Account({ user }: { user: User }) {
  const router = useRouter();
  const supabase = useSupabaseClient<Database>();
  const [loading, setLoading] = useState(true);
  const [username, usernameSet] = useState<Profiles["username"]>(null);
  const [twitterProfile, twitterProfileSet] =
    useState<Profiles["twitter_profile"]>(null);
  const [avatarUrl, avatarUrlSet] = useState<Profiles["avatar_url"]>(null);

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
    } catch (error) {
      alert("Error updating the data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* <SEO /> */}
      <main>
        <Container size="xs" pt={{ base: 50, sm: 90 }} pb={60}>
          <Stack spacing="md">
            <TextInput size="lg" label="E-mail" value={user.email} disabled />
            <TextInput
              size="lg"
              label="Username"
              value={username || ""}
              onChange={(e) => usernameSet(e.target.value)}
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
                    router.push("/signin");
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
  // Create authenticated Supabase Client
  const supabase = createPagesServerClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/signin",
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

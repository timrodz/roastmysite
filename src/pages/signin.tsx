import { getURL } from "@/utils/helpers";
import { Button, Container } from "@mantine/core";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SignIn() {
  const session = useSession();
  const router = useRouter();
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (session) {
      router.push("/account");
    }
  }, [session]);

  return (
    <>
      {/* <SEO /> */}
      <main>
        <Container pt={{ base: 50, sm: 90 }} pb={60}>
          <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
            <Auth
              supabaseClient={supabase}
              providers={["github"]}
              redirectTo={getURL()}
              magicLink={true}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "#364fc7",
                      brandAccent: "#364fc7",
                    },
                  },
                },
              }}
            />
          </div>
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

  if (session)
    return {
      redirect: {
        destination: "/account",
        permanent: false,
      },
    };

  return {
    props: {},
  };
};

/** TODO: eventually create own login UI */
import SEO from "@/components/SEO";
import { getSiteURL } from "@/utils/helpers";
import { useGlobalStyles } from "@/utils/use-global-styles";
import { Container } from "@mantine/core";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SignIn() {
  const { classes } = useGlobalStyles();
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
      <SEO title="Login" description="Login page for Roast My Site" />
      <main>
        <Container size="md" className={classes.pageWrapper}>
          <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
            <Auth
              supabaseClient={supabase}
              providers={["github"]}
              redirectTo={getSiteURL()}
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

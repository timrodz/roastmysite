/** TODO: eventually create own login UI */
import SEO from "@components/misc/SEOComponent";
import { Database } from "@lib/database.types";
import { getSiteURL } from "@utils/helpers";
import { useGlobalStyles } from "@utils/use-global-styles";
import { Container } from "@mantine/core";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const config = {
  runtime: "edge",
};

export default function SignIn() {
  const { classes } = useGlobalStyles();
  const session = useSession();
  const router = useRouter();
  const supabase = useSupabaseClient<Database>();

  useEffect(() => {
    if (!router) {
      return;
    }
    // Redirect to account because user is already logged in
    if (session) {
      router.push("/account");
    }
  }, [router, session]);

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
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const supabase = createPagesServerClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return {
      redirect: {
        destination: "/account",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

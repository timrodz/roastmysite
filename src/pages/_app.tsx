import Footer from "@/layout/Footer";
import Navbar from "@/layout/Navbar";
import { Flex, MantineProvider } from "@mantine/core";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import type { AppProps } from "next/app";
import { useState } from "react";

import "@/styles/globals.css";
import { cache } from "../../emotion-cache";

export default function App({ Component, pageProps }: AppProps) {
  const [supabase] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <MantineProvider
        emotionCache={cache}
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          primaryColor: "indigo",
          primaryShade: 9,
          colorScheme: "light",
          globalStyles: (theme) => ({
            "*": {
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
              // Add underline to span + a on hover
              "button, a": {
                ":hover": {
                  textDecorationLine: "underline",
                },
              },
            },
          }),
        }}
      >
        <Flex mih={"100vh"} direction="column">
          <Navbar />
          <Component {...pageProps} />
          <Footer />
        </Flex>
      </MantineProvider>
    </SessionContextProvider>
  );
}

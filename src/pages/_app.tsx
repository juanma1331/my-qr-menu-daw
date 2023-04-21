import type { ReactElement } from "react";
import type { NextPage } from "next";
import { type AppType } from "next/app";
import { Inter as FontSans } from "next/font/google";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "react-query-devtools";

import { api } from "~/utils/api";
import AuthGuard, {
  type WithAuthentication,
} from "~/components/Auth/AuthGuard";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement;
};

export type NextPageWithAuthentication = WithAuthentication<NextPageWithLayout>;

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const C = Component as NextPageWithAuthentication;
  const getLayout =
    (Component as NextPageWithLayout).getLayout ?? ((page) => page); // TS HACK

  const layout = getLayout(<Component {...pageProps} />);

  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-sans: ${fontSans.style.fontFamily};
          }
        `}
      </style>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <ModalsProvider>
          <SessionProvider session={session}>
            <ReactQueryDevtools initialIsOpen={true} />
            {C.auth ? <AuthGuard auth={C.auth}>{layout}</AuthGuard> : layout}
          </SessionProvider>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
};

export default api.withTRPC(MyApp);

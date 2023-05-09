import { type ReactElement } from "react";
import type { NextPage } from "next";
import { type AppType } from "next/app";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";
import AuthGuard, {
  type WithAuthentication,
} from "~/components/Auth/AuthGuard";
import { theme } from "~/styles/theme";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement;
};

export type NextPageWithAuthentication = WithAuthentication<NextPageWithLayout>;

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
      <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
        <ModalsProvider>
          <Notifications />
          <SessionProvider session={session}>
            {C.auth ? <AuthGuard auth={C.auth}>{layout}</AuthGuard> : layout}
          </SessionProvider>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
};

export default api.withTRPC(MyApp);

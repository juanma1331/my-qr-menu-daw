import type { PropsWithChildren } from "react";
import Head from "next/head";
import {
  AppShell as MAppShell,
  useMantineTheme,
  type AppShellProps,
} from "@mantine/core";

import Footer from "./Footer";

const AppShell: React.FC<PropsWithChildren<AppShellProps>> = ({
  children,
  ...rest
}) => {
  const theme = useMantineTheme();
  // Dejo el seo parcialmente comentado para que se pueda usar en el futuro
  const title = "MyQrMenu";
  // const description =
  // 'Sistema de gestión de menús accesibles a través de código qr para restaurantes y locales.';
  // const keywords = 'restaurantes, menús, productos, qr';
  return (
    <>
      <Head>
        <title>{title}</title>
        {/* <meta name="description" content={description} /> */}
        {/* <meta name="keywords" content={keywords} /> */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        {/* <meta property="og:title" content={title} /> */}
        {/* <meta property="og:description" content={description} /> */}
        {/* <meta property="og:type" content="website" /> */}
        {/* <meta property="og:url" content="https://www.example.com/" /> */}
        {/* <meta
          property="og:image"
          content="https://www.example.com/og-image.jpg"
        /> */}
      </Head>
      <MAppShell
        padding="xs"
        styles={{
          main: {
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.cGray[0],
          },
        }}
        footer={<Footer />}
        {...rest}
      >
        {children}
      </MAppShell>
    </>
  );
};

export default AppShell;

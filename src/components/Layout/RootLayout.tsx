import Head from "next/head";
import { ReactNode } from "react";
type RootLayoutProps = {
  children: ReactNode | ReactNode[];
  title?: string;
};

const RootLayout: React.FC<RootLayoutProps> = ({ children, title }) => {
  return (
    <>
      <Head>{title ?? "MyQRMenu"}</Head>
      {children}
    </>
  );
};

export default RootLayout;

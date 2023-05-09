import { type PropsWithChildren } from "react";

import AppShell from "./AppShell";

const AuthLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return <AppShell>{children}</AppShell>;
};

export default AuthLayout;

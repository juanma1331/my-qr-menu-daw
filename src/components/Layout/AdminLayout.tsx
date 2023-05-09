import { type PropsWithChildren } from "react";

import Header from "../Shared/Header/Header";
import AppShell from "./AppShell";

const AdminLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return <AppShell header={<Header />}>{children}</AppShell>;
};

export default AdminLayout;

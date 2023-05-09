import { useState, type PropsWithChildren } from "react";

import useAutoCloseOnNavigating from "../../Hooks/useAutoCloseOnNavigating";
import AppShell from "../AppShell";
import MenuHeader from "./MenuHeader";
import MenuNavbar from "./MenuNavbar";

const MenuLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const [opened, setOpened] = useState(false);
  useAutoCloseOnNavigating({ closeHandler: () => setOpened(false) });

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={<MenuNavbar opened={opened} />}
      header={
        <MenuHeader
          navbarOpened={opened}
          onNavbarOpen={() => setOpened((o) => !o)}
        />
      }
    >
      {children}
    </AppShell>
  );
};

export default MenuLayout;

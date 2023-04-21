import { type ReactElement, useState, createContext } from "react";
import { AppShell, Loader, useMantineTheme } from "@mantine/core";
import MenuNavbar from "../Menus/Menu/MenuNavbar";
import MenuHeader from "../Menus/Menu/MenuHeader";
import useAutoCloseOnNavigating from "../Hooks/useAutoCloseOnNavigating";

// Create a react context to share the pubished state of the menu with the provider

const MenuLayout: React.FC<{ children: ReactElement }> = ({ children }) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  // Hook de utilidad para cerrar la navegación cuando ha finalizado la carga de la nueva ruta
  useAutoCloseOnNavigating({ closeHandler: () => setOpened(false) });

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
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

import Link from "next/link";
import { useRouter } from "next/router";
import { Divider, NavLink, Navbar, useMantineTheme } from "@mantine/core";
import {
  IconBook,
  IconSettings,
  IconTarget,
  IconToolsKitchen,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";

import User from "./User";

type MenuNavbarProps = {
  opened: boolean;
};

const MenuNavbar: React.FC<MenuNavbarProps> = ({ opened }) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const { data: session } = useSession();

  const menuId = router.query.menuId as string;
  const user = session?.user;

  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
      style={{ backgroundColor: theme.colors.gray[3] }}
    >
      <Navbar.Section>
        <NavLink
          component={Link}
          href="/menus"
          label="Mis Menús"
          icon={<IconToolsKitchen />}
        />
      </Navbar.Section>

      <Divider m="sm" />

      <Navbar.Section grow>
        <NavLink
          component={Link}
          href={`/menus/${menuId}`}
          label="Propiedades"
          icon={<IconSettings />}
          active={router.pathname === "/menus/[menuId]"}
        />
        <NavLink
          component={Link}
          href={`/menus/${menuId}/sections`}
          label="Secciones"
          icon={<IconBook />}
          active={router.pathname.includes("sections")}
        />
        <NavLink
          component={Link}
          href={`/menus/${menuId}/products`}
          label="Productos"
          icon={<IconTarget />}
          active={router.pathname.includes("products")}
        />
      </Navbar.Section>

      <Navbar.Section>
        <User
          user={{
            email: user?.email ?? undefined,
            name: user?.name ?? undefined,
            image: user?.image ?? undefined,
          }}
        />
      </Navbar.Section>
    </Navbar>
  );
};

export default MenuNavbar;

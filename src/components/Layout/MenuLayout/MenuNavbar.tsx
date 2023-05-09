import Link from "next/link";
import { useRouter } from "next/router";
import { Divider, NavLink, Navbar, useMantineTheme } from "@mantine/core";
import {
  IconBook,
  IconEye,
  IconSettings,
  IconTarget,
  IconToolsKitchen,
} from "@tabler/icons-react";

type MenuNavbarProps = {
  opened: boolean;
};

const MenuNavbar: React.FC<MenuNavbarProps> = ({ opened }) => {
  const theme = useMantineTheme();
  const router = useRouter();

  const menuId = router.query.menuId as string;

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
          icon={<IconToolsKitchen size={22} />}
        />
      </Navbar.Section>

      <Divider m="sm" />

      <Navbar.Section>
        <NavLink
          component={Link}
          href={`/menus/${menuId}`}
          label="Propiedades"
          icon={<IconSettings size={22} />}
          active={router.pathname === "/menus/[menuId]"}
          color="cPink.3"
        />
        <NavLink
          component={Link}
          href={`/menus/${menuId}/sections`}
          label="Secciones"
          icon={<IconBook size={22} />}
          active={router.pathname.includes("sections")}
          color="cPink.3"
        />
        <NavLink
          component={Link}
          href={`/menus/${menuId}/products`}
          label="Productos"
          icon={<IconTarget size={22} />}
          active={router.pathname.includes("products")}
          color="cPink.3"
        />

        <Divider m="sm" />

        <NavLink
          component={Link}
          href={`/menus/${menuId}/preview`}
          label="Preview"
          icon={<IconEye size={22} />}
          active={router.pathname.includes("preview")}
          color="cPink.3"
        />
      </Navbar.Section>
    </Navbar>
  );
};

export default MenuNavbar;

import { Burger, MediaQuery, useMantineTheme } from "@mantine/core";

import AppHeader from "../../Shared/AppHeader";

type MenuHeaderProps = {
  navbarOpened: boolean;
  onNavbarOpen: () => void;
};

const MenuHeader: React.FC<MenuHeaderProps> = ({
  navbarOpened,
  onNavbarOpen,
}) => {
  const theme = useMantineTheme();

  return (
    <AppHeader
      actions={
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={navbarOpened}
            onClick={() => onNavbarOpen()}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>
      }
    />
  );
};

export default MenuHeader;

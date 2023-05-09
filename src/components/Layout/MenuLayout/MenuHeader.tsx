import { Burger, MediaQuery, useMantineTheme } from "@mantine/core";

import Header from "~/components/Shared/Header/Header";

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
    <Header
      burger={
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={navbarOpened}
            onClick={() => onNavbarOpen()}
            size="sm"
            color={theme.colors.cGray[6]}
            mr="xl"
          />
        </MediaQuery>
      }
    />
  );
};

export default MenuHeader;

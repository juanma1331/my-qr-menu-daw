import {
  Burger,
  MediaQuery,
  createStyles,
  useMantineTheme,
} from "@mantine/core";

import Header from "~/components/Shared/Header/Header";

export type MenuHeaderProps = {
  navbarOpened: boolean;
  onNavbarOpen: () => void;
};

const useStyles = createStyles((theme) => ({
  burguer: {
    "&:focus": {
      outline: `1px solid ${theme.colors.cPink[4]}`,
    },
  },
}));

const MenuHeader: React.FC<MenuHeaderProps> = ({
  navbarOpened,
  onNavbarOpen,
}) => {
  const theme = useMantineTheme();
  const { classes } = useStyles();

  return (
    <Header
      burger={
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={navbarOpened}
            onClick={() => onNavbarOpen()}
            size="sm"
            color={theme.colors.cGray[6]}
            className={classes.burguer}
            mr="xl"
          />
        </MediaQuery>
      }
    />
  );
};

export default MenuHeader;

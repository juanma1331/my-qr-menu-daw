import { Box, Group, Header as MHeader, createStyles } from "@mantine/core";

import BrandLogo from "../BrandLogo";
import LogoutButton from "./LogoutButton";
import User from "./User";

export type HeaderProps = {
  burger?: React.ReactNode;
  className?: string;
};

const useStyles = createStyles(() => ({
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
  },
}));

const Header: React.FC<HeaderProps> = ({ burger, className }) => {
  const { classes } = useStyles();
  return (
    <MHeader className={className} height={{ base: 70 }} p="md">
      <Box className={classes.box}>
        {burger}
        <BrandLogo />

        <Group>
          <User />
          <LogoutButton />
        </Group>
      </Box>
    </MHeader>
  );
};

export default Header;

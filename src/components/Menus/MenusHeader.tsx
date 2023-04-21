import { Header, Text } from "@mantine/core";
import LogoutButton from "../Shared/LogoutButton";

const MenusHeader = () => {
  return (
    <Header height={{ base: 50, md: 70 }} p="md">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Text>MyBrandLogo</Text>
        <LogoutButton />
      </div>
    </Header>
  );
};

export default MenusHeader;

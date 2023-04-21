import { Header, Text } from "@mantine/core";
import type { ReactElement } from "react";
import LogoutButton from "./LogoutButton";

const AppHeader: React.FC<{ actions?: ReactElement }> = ({ actions }) => {
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
        {actions}
        <LogoutButton />
      </div>
    </Header>
  );
};

export default AppHeader;

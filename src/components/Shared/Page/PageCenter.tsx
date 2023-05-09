import { Center } from "@mantine/core";
import type { ReactElement } from "react";

const PageCenter: React.FC<{ children: ReactElement; h?: string }> = ({
  children,
  h,
}) => {
  return (
    <Center h={h ?? "calc(100vh - 200px)"} p="sm">
      {children}
    </Center>
  );
};

export default PageCenter;

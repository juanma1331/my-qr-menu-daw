import { Button, Paper, Stack, useMantineTheme, Text } from "@mantine/core";
import Link from "next/link";
import type { ReactElement } from "react";

const PageError: React.FC<{ children: ReactElement }> = ({ children }) => {
  const theme = useMantineTheme();

  return (
    <Paper
      withBorder
      shadow="sm"
      p="sm"
      style={{ borderColor: theme.colors.red[3] }}
    >
      {children}
    </Paper>
  );
};

export default PageError;

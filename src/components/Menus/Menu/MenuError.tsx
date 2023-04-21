import { Button, Paper, Stack, useMantineTheme, Text } from "@mantine/core";
import Link from "next/link";

const MenuError: React.FC = () => {
  return (
    <Stack>
      <Text>
        Lamentablemente no pudimos obtener tu menú debido a un problema interno
      </Text>
      <Button component={Link} href="/menus">
        Volver
      </Button>
    </Stack>
  );
};

export default MenuError;

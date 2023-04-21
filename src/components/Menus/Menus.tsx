import Link from "next/link";
import {
  ActionIcon,
  Badge,
  Card,
  Center,
  Grid,
  Group,
  Indicator,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import {
  IconEyeCheck,
  IconLock,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";

import type { RouterOutputs } from "~/utils/api";

type MenusProps = RouterOutputs["menus"]["getMenusInfo"] & {
  onRemove: (menuId: string) => void;
};

const Menus: React.FC<MenusProps> = ({ menus, onRemove }) => {
  const theme = useMantineTheme();
  if (menus.length === 0) {
    return (
      <Center>
        <Text color="dimmed">Actualmente no hay menus</Text>
      </Center>
    );
  }

  return (
    <Grid>
      {menus.map((m) => (
        <Grid.Col sm={6} key={randomId()}>
          <Indicator
            label={
              m.isPublic ? <IconEyeCheck size={18} /> : <IconLock size={18} />
            }
            size={18}
            color={m.isPublic ? theme.colors.green[4] : theme.colors.red[4]}
          >
            <Card
              style={{ position: "relative" }}
              shadow="sm"
              p="lg"
              radius="md"
              withBorder
            >
              <Grid style={{ position: "relative", zIndex: 1 }}>
                <Grid.Col>
                  <Title align="center" color={theme.colors.gray[7]} order={5}>
                    {m.title}
                  </Title>
                </Grid.Col>
                <Grid.Col>
                  <Center>
                    <Badge size="xs" rightSection={m.sections}>
                      Secciones
                    </Badge>
                  </Center>
                </Grid.Col>
                <Grid.Col>
                  <Center>
                    <Badge
                      color={theme.colors.red[3]}
                      size="xs"
                      rightSection={m.products}
                    >
                      Productos
                    </Badge>
                  </Center>
                </Grid.Col>
                <Grid.Col>
                  <Group align="center" position="center">
                    <ActionIcon
                      bg="dark"
                      color="red"
                      onClick={() => onRemove(m.menuId)}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>

                    <ActionIcon
                      component={Link}
                      href={`menus/${m.menuId}`}
                      color="blue"
                      bg="dark"
                    >
                      <IconPencil size={18} />
                    </ActionIcon>
                  </Group>
                </Grid.Col>
              </Grid>
            </Card>
          </Indicator>
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default Menus;

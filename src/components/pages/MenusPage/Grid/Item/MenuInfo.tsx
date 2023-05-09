import { Group, Text } from "@mantine/core";

export type MenuInfoProps = {
  sections: number;
  products: number;
};

const MenuInfo: React.FC<MenuInfoProps> = ({ sections, products }) => {
  return (
    <>
      <Group position="apart">
        <Text size="sm" color="cGray.6">
          Secciones
        </Text>
        <Text size="xs" color="cGray.4">
          {sections}
        </Text>
      </Group>

      <Group position="apart">
        <Text size="sm" color="cGray.6">
          Productos
        </Text>
        <Text size="xs" color="cGray.4">
          {products}
        </Text>
      </Group>
    </>
  );
};

export default MenuInfo;

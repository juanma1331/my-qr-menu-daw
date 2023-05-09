import { Badge, Group, Text } from "@mantine/core";

export type MenuTitleProps = {
  title: string;
  isPublic: boolean;
};

const MenuTitle: React.FC<MenuTitleProps> = ({ title, isPublic }) => {
  return (
    <Group position="apart">
      <Text weight={500} color="cGray.7">
        {title}
      </Text>
      {isPublic ? (
        <Badge color="green.6" variant="outline">
          Publicado
        </Badge>
      ) : (
        <Badge color="red.4" variant="outline">
          Sin Publicar
        </Badge>
      )}
    </Group>
  );
};

export default MenuTitle;

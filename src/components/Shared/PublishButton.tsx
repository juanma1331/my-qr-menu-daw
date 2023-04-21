import { Button, Group, Text, useMantineTheme } from "@mantine/core";
import { IconEyeCheck } from "@tabler/icons-react";

type PublishButtonProps = {
  onClick: () => void;
  published: boolean;
};

const PublishButton: React.FC<PublishButtonProps> = ({
  onClick,
  published,
}) => {
  const theme = useMantineTheme();

  if (published) {
    return (
      <Group spacing="xs">
        <Text color={theme.colors.green[7]}>Publicado</Text>
        <IconEyeCheck color={theme.colors.green[7]} size={16} />
      </Group>
    );
  }

  return (
    <Button
      size="xs"
      variant="outline"
      color="green"
      rightIcon={<IconEyeCheck size={16} />}
      onClick={onClick}
    >
      Publicar
    </Button>
  );
};

export default PublishButton;

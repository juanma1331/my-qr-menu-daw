import { Button, Group, Text, useMantineTheme } from "@mantine/core";
import { IconEyeCheck } from "@tabler/icons-react";

import { api } from "~/utils/api";

export type PublishError = "no-sections" | "empty-section";

type PublishButtonProps = {
  published: boolean;
  menuId: string;
  onPublishError: (error: PublishError) => void;
};

const PublishButton: React.FC<PublishButtonProps> = ({
  published,
  menuId,
  onPublishError,
}) => {
  const theme = useMantineTheme();
  const utils = api.useContext();

  const publishMenuVersionMutation = api.menus.publishMenuVersion.useMutation({
    onSuccess: async (publishResponse) => {
      if (publishResponse.publishStatus === "no-sections") {
        onPublishError("no-sections");
      } else if (publishResponse.publishStatus === "empty-section") {
        onPublishError("empty-section");
      } else {
        await utils.menus.invalidate();
      }
    },
    onError: (error) => console.log(error),
  });

  const unpublishMenuVersionMutation =
    api.menus.unpublishMenuVersion.useMutation({
      onSuccess: async () => {
        await utils.menus.invalidate();
      },
      onError: (error) => console.log(error),
    });

  if (published) {
    return (
      <Button
        size="xs"
        variant="outline"
        color="red"
        loading={unpublishMenuVersionMutation.isLoading}
        rightIcon={<IconEyeCheck color="red" size={16} />}
        onClick={() =>
          unpublishMenuVersionMutation.mutate({
            menuId,
          })
        }
      >
        No Público
      </Button>
    );
  }

  return (
    <Button
      size="xs"
      variant="outline"
      color="green"
      loading={publishMenuVersionMutation.isLoading}
      rightIcon={<IconEyeCheck size={16} />}
      onClick={() =>
        publishMenuVersionMutation.mutate({
          menuId,
        })
      }
    >
      Publicar
    </Button>
  );
};

export default PublishButton;

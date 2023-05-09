import { IconEyeCheck } from "@tabler/icons-react";

import { api } from "~/utils/api";
import { notificateError, notificateSuccess } from "../notifications";
import Button from "./Button";

export type PublishError = "no-sections" | "empty-section";

type PublishButtonProps = {
  published: boolean;
  menuId: string;
  onInternalError: () => void;
};

const PublishButton: React.FC<PublishButtonProps> = ({
  published,
  menuId,
  onInternalError,
}) => {
  const utils = api.useContext();

  const publishMenuVersionMutation = api.menus.publishMenuVersion.useMutation({
    onSuccess: async (publishResponse) => {
      if (publishResponse.publishStatus === "no-sections") {
        notificateError({
          title: "No hay secciones",
          message:
            "No se puede publicar un menú sin secciones. Agrega una sección!",
        });
      } else if (publishResponse.publishStatus === "empty-section") {
        notificateError({
          title: "Sección vacía",
          message:
            "No se puede publicar un menú con una sección vacía. Agrega un producto!",
        });
      } else {
        await utils.menus.invalidate();
        notificateSuccess({
          title: "Menú publicado",
          message: "El menú se ha publicado correctamente",
        });
      }
    },
    onError: (error) => console.log(error),
  });

  const unpublishMenuVersionMutation =
    api.menus.unpublishMenuVersion.useMutation({
      onSuccess: async () => {
        await utils.menus.invalidate();
      },
      onError: () => onInternalError(),
    });

  if (published) {
    return (
      <Button
        size="xs"
        variant="outline"
        color="red.5"
        loading={unpublishMenuVersionMutation.isLoading}
        rightIcon={<IconEyeCheck color="red" size={16} />}
        onClick={() =>
          unpublishMenuVersionMutation.mutate({
            menuId,
          })
        }
      >
        No Publicar
      </Button>
    );
  }

  return (
    <Button
      size="xs"
      color="cEmerald.5"
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

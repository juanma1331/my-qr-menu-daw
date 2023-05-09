import { Group, createStyles } from "@mantine/core";
import { IconPencil, IconQrcode, IconTrash } from "@tabler/icons-react";
import { getCldImageUrl } from "next-cloudinary";

import ActionIcon from "~/components/Shared/ActionIcon";
import ActionIconLink from "~/components/Shared/ActionIconLink";
import PopOver from "~/components/Shared/PopOver";

export type MenuActionsProps = {
  menuId: string;
  qrImageId: string;
  onRemove: (menuId: string) => void;
};

const useStyles = createStyles((theme) => ({
  root: {
    border: `1px solid ${theme.colors.cGray[1]}`,
    "&:focus": {
      outline: `1px solid ${theme.colors.cPink[3]}`,
    },
  },
}));

const MenuActions: React.FC<MenuActionsProps> = ({
  menuId,
  onRemove,
  qrImageId,
}) => {
  const { classes } = useStyles();

  const downloadImage = async (url: string) => {
    // Las soluciones más simples para descargar no funcionan correctamente.
    const response = await fetch(url);
    const blob = await response.blob();
    const newUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = newUrl;
    link.download = "qr_code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  return (
    <Group position="right">
      <PopOver text="Borrar" width={66} textSize="xs">
        <ActionIcon onClick={() => onRemove(menuId)}>
          <IconTrash size={16} />
        </ActionIcon>
      </PopOver>

      <PopOver text="Editar" width={66} textSize="xs">
        <ActionIconLink href={`/menus/${menuId}`}>
          <IconPencil size={16} />
        </ActionIconLink>
      </PopOver>

      <PopOver text="Descargar QR" width={120} textSize="xs">
        <ActionIcon
          onClick={() =>
            downloadImage(getCldImageUrl({ src: qrImageId, format: "png" }))
          }
        >
          <IconQrcode size={16} />
        </ActionIcon>
      </PopOver>
    </Group>
  );
};

export default MenuActions;

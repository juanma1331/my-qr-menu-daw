import { Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import type { OpenConfirmModal } from "@mantine/modals/lib/context";

export interface OpenDeleteConfirmModal extends OpenConfirmModal {
  body: string;
  onConfirmDelete: () => void;
}

export const openDeleteConfirmModal = ({
  body,
  onConfirmDelete,
  ...rest
}: OpenDeleteConfirmModal) => {
  return openConfirmModal({
    centered: true,
    children: (
      <Text color="cGray.6" size="sm">
        {body}
      </Text>
    ),
    labels: { confirm: "Borrar", cancel: "Cancelar" },
    confirmProps: { color: "red.5", radius: "xs" },
    cancelProps: { radius: "xs" },
    onConfirm: onConfirmDelete,
    ...rest,
  });
};

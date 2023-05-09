import type { PropsWithChildren } from "react";
import { Modal as MModal, createStyles, type ModalProps } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  close: {
    "&:focus": {
      outline: `1px solid ${theme.colors.cPink[3]}`,
    },
  },
}));

const Modal: React.FC<PropsWithChildren<ModalProps>> = ({
  children,
  opened,
  title,
  onClose,
  ...rest
}) => {
  const { classes } = useStyles();
  return (
    <MModal
      opened={opened}
      onClose={onClose}
      title={title}
      radius="sm"
      classNames={{
        close: classes.close,
      }}
      {...rest}
    >
      {children}
    </MModal>
  );
};

export default Modal;

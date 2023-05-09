import {
  ActionIcon,
  CloseButton,
  createStyles,
  type ActionIconProps,
  type CloseButtonProps,
} from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";

export type EditModeTogglerProps = {
  editMode: boolean;
  actionProps?: ActionIconProps;
  closeProps?: CloseButtonProps;
  onEnterEditMode: () => void;
  onExitEditMode: () => void;
};

const useStyles = createStyles((theme) => ({
  actionIcon: {
    "&:focus": {
      outline: `1px solid ${theme.colors.cPink[3]}`,
    },
  },
}));

const EditModeToggler: React.FC<EditModeTogglerProps> = ({
  editMode,
  actionProps,
  closeProps,
  onEnterEditMode,
  onExitEditMode,
}) => {
  const { classes } = useStyles();
  if (editMode) {
    return (
      <CloseButton
        className={classes.actionIcon}
        onClick={() => onExitEditMode()}
        {...closeProps}
      />
    );
  }

  return (
    <ActionIcon
      className={classes.actionIcon}
      color="cGray.3"
      variant="outline"
      onClick={() => onEnterEditMode()}
      {...actionProps}
    >
      <IconPencil size={16} />
    </ActionIcon>
  );
};

export default EditModeToggler;

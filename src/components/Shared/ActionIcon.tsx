import type { PropsWithChildren } from "react";
import {
  ActionIcon as MActionIcon,
  createStyles,
  type ActionIconProps as MActionIconProps,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  root: {
    border: `1px solid ${theme.colors.cGray[1]}`,
    "&:focus": {
      outline: `1px solid ${theme.colors.cPink[3]}`,
    },
  },
}));

interface ActionIconProps extends MActionIconProps {
  onClick?: () => void;
}

const ActionIcon: React.FC<PropsWithChildren<ActionIconProps>> = ({
  onClick,
  children,
  ...rest
}) => {
  const { classes } = useStyles();

  return (
    <MActionIcon
      color="cGray.7"
      variant="outline"
      className={classes.root}
      onClick={onClick}
      {...rest}
    >
      {children}
    </MActionIcon>
  );
};

export default ActionIcon;

import type { PropsWithChildren } from "react";
import Link from "next/link";
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

interface ActionIconLinkProps extends MActionIconProps {
  href: string;
}

const ActionIconLink: React.FC<PropsWithChildren<ActionIconLinkProps>> = ({
  href,
  children,
  ...rest
}) => {
  const { classes } = useStyles();

  return (
    <MActionIcon
      component={Link}
      href={href}
      color="cGray.7"
      variant="outline"
      className={classes.root}
      {...rest}
    >
      {children}
    </MActionIcon>
  );
};

export default ActionIconLink;

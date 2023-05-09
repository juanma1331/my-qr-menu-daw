import Link from "next/link";
import {
  Button,
  createStyles,
  type ButtonProps as MButtonProps,
} from "@mantine/core";

export type ButtonPrimaryLinkProps = MButtonProps & {
  to: string;
};

const useStyles = createStyles((theme) => ({
  primary: {
    "&:focus": {
      outline: `1px solid ${theme.colors.cPink[3]}`,
    },
  },
}));

const ButtonLink: React.FC<ButtonPrimaryLinkProps> = ({
  children,
  to,
  ...rest
}) => {
  const { classes } = useStyles();

  return (
    <Button
      component={Link}
      href={to}
      className={classes.primary}
      color="cPink.3"
      radius="xs"
      {...rest}
    >
      {children}
    </Button>
  );
};

export default ButtonLink;

import {
  Button as MButton,
  createStyles,
  type ButtonProps as MButtonProps,
} from "@mantine/core";

export type ButtonPrimaryProps = MButtonProps & {
  vr?: "primary" | "neutral";
  onClick?: () => void;
};

const useStyles = createStyles((theme) => ({
  primary: {
    "&:focus": {
      outline: `1px solid ${theme.colors.cPink[3]}`,
    },
  },
  neutral: {
    color: theme.colors.cGray[7],
    border: `1px solid ${theme.colors.cGray[3]}`,
    backgroundColor: "transparent",
    "&:focus": {
      outline: `1px solid ${theme.colors.cPink[3]}`,
    },
    "&:hover": {
      backgroundColor: theme.colors.cGray[0],
    },
  },
}));

const Button: React.FC<ButtonPrimaryProps> = ({
  children,
  onClick,
  vr = "primary",
  ...rest
}) => {
  const { classes } = useStyles();
  return (
    <MButton
      className={vr === "primary" ? classes.primary : classes.neutral}
      color="cPink.3"
      radius="xs"
      size="xs"
      onClick={onClick}
      {...rest}
    >
      {children}
    </MButton>
  );
};

export default Button;

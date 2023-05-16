import type { PropsWithChildren } from "react";
import { Title, createStyles, type TitleProps } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  root: {
    fontSize: theme.fontSizes.lg,
  },
}));

const PageSectionTitle: React.FC<PropsWithChildren<TitleProps>> = ({
  children,
  ...rest
}) => {
  const { classes } = useStyles();

  return (
    <Title className={classes.root} color="cGray.8" order={2} {...rest}>
      {children}
    </Title>
  );
};

export default PageSectionTitle;

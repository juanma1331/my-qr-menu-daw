import { Stack, Text, Title, createStyles } from "@mantine/core";

import { josefinSans } from "~/styles/typography";

export type VersionTitleProps = {
  title: string;
  subtitle: string | null;
};

const useStyles = createStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  title: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.cGray[0],
    fontFamily: josefinSans.style.fontFamily,
    [theme.fn.largerThan("md")]: {
      fontSize: theme.fontSizes.lg,
    },
  },
  subtitle: {
    color: theme.colors.cGray[2],
    fontSize: theme.fontSizes.sm,
    fontFamily: josefinSans.style.fontFamily,
    [theme.fn.largerThan("md")]: {
      fontSize: theme.fontSizes.md,
    },
  },
}));

const VersionTitle: React.FC<VersionTitleProps> = ({ title, subtitle }) => {
  const { classes } = useStyles();

  return (
    <Stack className={classes.root}>
      <Title className={classes.title} order={1}>
        {title}
      </Title>
      {subtitle && <Text className={classes.subtitle}>{subtitle}</Text>}
    </Stack>
  );
};

export default VersionTitle;

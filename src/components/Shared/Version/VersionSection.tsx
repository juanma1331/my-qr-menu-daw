import { Box, Paper, Title, createStyles } from "@mantine/core";
import { randomId } from "@mantine/hooks";

import { josefinSans } from "~/styles/typography";
import type { Section } from "./Version";
import VersionProduct from "./VersionProduct";

export type VersionSectionProps = {
  section: Section;
};

const useStyles = createStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.md,
    alignItems: "center",
  },
  section: {
    width: "100%",
    backgroundColor: theme.colors.gray[0],
  },
  products: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.xs,
    width: "90%",
  },
  name: {
    fontFamily: josefinSans.style.fontFamily,
    fontSize: theme.fontSizes.lg,
  },
}));

const VersionSection: React.FC<VersionSectionProps> = ({ section }) => {
  const { classes } = useStyles();
  return (
    <Box className={classes.root}>
      <Paper p="sm" shadow="lg" className={classes.section}>
        <Title className={classes.name} color="cGray.9" order={2}>
          {section.name}
        </Title>
      </Paper>

      <Box className={classes.products}>
        {section.products.map((product) => (
          <VersionProduct key={randomId()} product={product} />
        ))}
      </Box>
    </Box>
  );
};

export default VersionSection;

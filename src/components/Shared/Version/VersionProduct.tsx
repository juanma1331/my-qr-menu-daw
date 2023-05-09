import { Box, Group, Paper, Stack, Text, createStyles } from "@mantine/core";
import { CldImage } from "next-cloudinary";

import { formatPrice } from "~/utils/client";
import { josefinSans } from "~/styles/typography";
import type { Product } from "./Version";

export type VersionProductProps = {
  product: Product;
};

const useStyles = createStyles((theme) => ({
  root: {
    display: "grid",
    gridTemplateColumns: "66px 3.5fr 66px",
    gap: theme.spacing.xs,
  },
  image: {
    borderRadius: theme.radius.sm,
  },
  name: {
    fontFamily: josefinSans.style.fontFamily,
    fontSize: theme.fontSizes.md,
  },
  description: {
    fontFamily: josefinSans.style.fontFamily,
    fontSize: theme.fontSizes.xs,
  },
  price: {
    borderRadius: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      "0 2px 4px rgba(243, 89, 153, 0.2), 0 2px 6px rgba(243, 89, 153, 0.32)",
  },
}));

const VersionProduct: React.FC<VersionProductProps> = ({ product }) => {
  const { classes } = useStyles();

  return (
    <Paper p="xs" shadow="md" className={classes.root}>
      <CldImage
        height={66}
        width={66}
        priority
        className={classes.image}
        src={product.imageId}
        alt={product.name}
        effects={[
          {
            improve: true,
          },
        ]}
      />

      <Group w="100%">
        <Stack spacing="xs">
          <Text className={classes.name} color="cGray.9" weight={500}>
            {product.name}
          </Text>
          <Text className={classes.description} color="cGray.5" lineClamp={1}>
            {product.description ? product.description : "\u00A0"}
          </Text>
        </Stack>
      </Group>

      <Box className={classes.price}>
        <Text size="sm" color="cGray.9" weight={500}>
          {formatPrice(product.price)}
        </Text>
      </Box>
    </Paper>
  );
};

export default VersionProduct;

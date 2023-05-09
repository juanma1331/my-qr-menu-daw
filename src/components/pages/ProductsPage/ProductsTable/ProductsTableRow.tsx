import { Flex, createStyles } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { CldImage } from "next-cloudinary";

import type { RouterOutputs } from "~/utils/api";
import { formatPrice } from "~/utils/client";
import ActionIcon from "~/components/Shared/ActionIcon";

export type ProductsTableRowProps = {
  product: RouterOutputs["menus"]["getProductsWithSections"]["products"][0];
  onDelete: (productId: number) => void;
  onEdit: (productId: number) => void;
};

const useStyles = createStyles((theme) => ({
  image: {
    borderRadius: theme.radius.sm,
  },
}));

const ProductsTableRow: React.FC<ProductsTableRowProps> = ({
  product,
  onDelete,
  onEdit,
}) => {
  const { classes } = useStyles();
  return (
    <tr key={product.id}>
      <td>
        <CldImage
          src={product.imageId}
          width={50}
          height={50}
          priority
          className={classes.image}
          alt={`una imagen de ${product.name}`}
        />
      </td>

      <td>{product.name}</td>

      <td>{formatPrice(product.price)}</td>

      <td>{product.section.name}</td>

      <td>
        <Flex align="center" justify="start" gap="md">
          <ActionIcon onClick={() => onDelete(product.id)}>
            <IconTrash size={16} />
          </ActionIcon>

          <ActionIcon onClick={() => onEdit(product.id)}>
            <IconPencil size={16} />
          </ActionIcon>
        </Flex>
      </td>
    </tr>
  );
};

export default ProductsTableRow;

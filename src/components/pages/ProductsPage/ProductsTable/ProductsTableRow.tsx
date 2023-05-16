import { Flex, MediaQuery, Menu, createStyles } from "@mantine/core";
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react";
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
        <MediaQuery smallerThan="md" styles={{ display: "none" }}>
          <Flex align="center" justify="start" gap="md">
            <ActionIcon onClick={() => onDelete(product.id)}>
              <IconTrash size={16} />
            </ActionIcon>

            <ActionIcon onClick={() => onEdit(product.id)}>
              <IconPencil size={16} />
            </ActionIcon>
          </Flex>
        </MediaQuery>

        <MediaQuery largerThan="md" styles={{ display: "none" }}>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <IconDots size={16} />
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Acciones</Menu.Label>
              <Menu.Item
                icon={<IconTrash size={14} />}
                onClick={() => onDelete(product.id)}
              >
                Eliminar
              </Menu.Item>
              <Menu.Item
                icon={<IconPencil size={14} />}
                onClick={() => onEdit(product.id)}
              >
                Editar
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </MediaQuery>
      </td>
    </tr>
  );
};

export default ProductsTableRow;

import { ActionIcon, Table, Text, useMantineTheme } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { CldImage } from "next-cloudinary";

import type { RouterOutputs } from "~/utils/api";
import { formatPrice } from "~/utils/client";

type ProductsTableProps = {
  products: RouterOutputs["menus"]["getProductsWithSections"]["products"];
  onDelete: (productId: number) => void;
};

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onDelete,
}) => {
  const theme = useMantineTheme();

  const rows = products.map((product) => (
    <tr key={product.id}>
      <td>
        <CldImage
          src={product.imageId}
          width={50}
          height={50}
          style={{ borderRadius: theme.radius.sm }}
          alt={`una imagen de ${product.name}`}
        />
      </td>
      <td>{product.name}</td>
      <td>{formatPrice(product.price)}</td>
      <td>
        <Text lineClamp={1}>{product.description ?? "Sin descripción"}</Text>
      </td>
      <td>{product.section.name}</td>
      <td>
        <ActionIcon onClick={() => onDelete(product.id)}>
          <IconTrash size={16} />
        </ActionIcon>
      </td>
    </tr>
  ));

  return (
    <Table fontSize="xs">
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Descripción</th>
          <th>Sección</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default ProductsTable;

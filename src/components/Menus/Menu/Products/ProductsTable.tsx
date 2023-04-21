import { RouterOutputs } from "../../../../utils/trpc";
import NextImage from "next/image";
import { Table, useMantineTheme, Text } from "@mantine/core";
import { formatPrice } from "../../../../utils/utils";

type ProductsTableProps = {
  products: RouterOutputs["menus"]["getLatestVersionProducts"]["products"];
};

const ProductsTable: React.FC<ProductsTableProps> = ({ products }) => {
  const theme = useMantineTheme();

  const rows = products.map((product) => (
    <tr key={product.id}>
      <td>
        <NextImage
          src={product.image}
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
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default ProductsTable;

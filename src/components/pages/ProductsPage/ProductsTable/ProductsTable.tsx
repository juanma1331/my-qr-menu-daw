import { useCallback } from "react";
import { ScrollArea, Space, Table, createStyles } from "@mantine/core";
import { randomId } from "@mantine/hooks";

import type { RouterOutputs } from "~/utils/api";
import { useFilter } from "~/components/Hooks/useFilter";
import { useSearch } from "~/components/Hooks/useSearch";
import ProductsTableControls from "./ProductsTableControls";
import ProductsTableRow from "./ProductsTableRow";

export type Product =
  RouterOutputs["menus"]["getProductsWithSections"]["products"][0];

const isValidProperty = (property: string): property is keyof Product => {
  return ["section", "id", "name", "price", "imageId"].includes(property);
};

export type ProductsTableProps = {
  products: Product[];
  onDelete: (productId: number) => void;
  onEdit: (productId: number) => void;
};

const useStyles = createStyles(() => ({
  scrollArea: {
    height: 410,
  },
  table: {
    maxWidth: "80%",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onDelete,
  onEdit,
}) => {
  const { classes } = useStyles();
  const searchFilter = useCallback((data: Product[], query: string) => {
    return data.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, []);

  const sectionFilter = useCallback((options: Product[], section: string) => {
    if (section === "Todas") return options;
    return options.filter((product) => product.section.name === section);
  }, []);

  const propertyFilter = useCallback((options: Product[], property: string) => {
    if (property === "Todas" || !isValidProperty(property)) return options;

    return [...options].sort((a: Product, b: Product) =>
      a[property] > b[property] ? 1 : -1,
    );
  }, []);

  const { query, setQuery, searchResults } = useSearch<Product>({
    filter: searchFilter,
    data: products,
  });

  const {
    query: sectionQuery,
    setQuery: setSectionQuery,
    filtered: filteredBySection,
  } = useFilter<Product>({
    options: searchResults,
    filterFunction: sectionFilter,
  });

  const {
    query: propertyQuery,
    setQuery: setPropertyQuery,
    filtered: filteredByProperty,
  } = useFilter<Product>({
    options: filteredBySection,
    filterFunction: propertyFilter,
  });

  const sectionSelectData = () => {
    const sections = products.map((product) => product.section.name);
    const uniqueSections = [...new Set(sections)];
    const result = uniqueSections.map((section) => ({
      value: section,
      label: section,
    }));

    return [{ value: "Todas", label: "Todas" }, ...result];
  };

  const propertiesSelectData = () => {
    return [
      { value: "name", label: "Nombre" },
      { value: "price", label: "Precio" },
    ];
  };

  return (
    <>
      <ProductsTableControls
        selectSectionsData={sectionSelectData()}
        selectPropertiesData={propertiesSelectData()}
        searchQuery={query}
        setSearchQuery={setQuery}
        onPropertyChange={(property) => {
          setPropertyQuery(property);
        }}
        sectionFilterQuery={sectionQuery}
        onSectionChange={(section) => {
          setSectionQuery(section);
        }}
        propertyFilterQuery={propertyQuery}
      />

      <Space h="xs" />

      <ScrollArea type="always" className={classes.scrollArea}>
        <Table fontSize="xs" className={classes.table}>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Sección</th>
              <th>Acc</th>
            </tr>
          </thead>
          <tbody>
            {filteredByProperty.map((product) => (
              <ProductsTableRow
                key={randomId()}
                product={product}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </tbody>
        </Table>
      </ScrollArea>
    </>
  );
};

export default ProductsTable;

import { Flex, Group } from "@mantine/core";

import SearchInput from "~/components/Shared/Form/SearchInput";
import SelectInput from "~/components/Shared/Form/SelectInput";

export type ProductsTableControlsProps = {
  selectSectionsData: { value: string; label: string }[];
  selectPropertiesData: { value: string; label: string }[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSectionChange: (section: string) => void;
  sectionFilterQuery: string;
  onPropertyChange: (property: string) => void;
  propertyFilterQuery: string;
};

const ProductsTableControls: React.FC<ProductsTableControlsProps> = ({
  selectSectionsData,
  selectPropertiesData,
  searchQuery,
  setSearchQuery,
  onSectionChange,
  onPropertyChange,
  sectionFilterQuery,
  propertyFilterQuery,
}) => {
  return (
    <Flex direction="column" align="center" gap="md">
      <Group position="center">
        <SelectInput
          value={sectionFilterQuery}
          labelAlign="center"
          label="Filtro por sección"
          data={selectSectionsData}
          defaultValue="Todas"
          onChange={(e) => {
            if (!e) return;

            onSectionChange(e);
          }}
        />

        <SelectInput
          value={propertyFilterQuery}
          labelAlign="center"
          label="Filtro general"
          data={selectPropertiesData}
          defaultValue="Todas"
          onChange={(e) => {
            if (!e) return;

            onPropertyChange(e);
          }}
        />
      </Group>

      <SearchInput
        labelAlign="center"
        label="Búsqueda"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.currentTarget.value)}
        w="50%"
      />
    </Flex>
  );
};

export default ProductsTableControls;

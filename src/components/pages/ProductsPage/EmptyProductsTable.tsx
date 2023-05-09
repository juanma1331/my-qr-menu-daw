import { Center, Text } from "@mantine/core";

const EmptyProductsTable: React.FC = () => {
  return (
    <Center h="200px">
      <Text size="md" color="cGray.3">
        Este menú no tiene productos
      </Text>
    </Center>
  );
};

export default EmptyProductsTable;

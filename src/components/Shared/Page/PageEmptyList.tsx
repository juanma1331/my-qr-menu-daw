import { Center, Stack, Text } from "@mantine/core";

export type PageEmptyListProps = {
  text: string;
  action?: React.ReactNode;
};

const PageEmptyList: React.FC<PageEmptyListProps> = ({ text, action }) => {
  return (
    <Center h="100%">
      <Stack align="center">
        <Text size="sm" color="cGray.6">
          {text}
        </Text>
        {action}
      </Stack>
    </Center>
  );
};

export default PageEmptyList;

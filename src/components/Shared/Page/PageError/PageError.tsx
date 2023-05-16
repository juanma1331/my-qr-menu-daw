import Image from "next/image";
import { useRouter } from "next/router";
import { Flex, Stack, Text } from "@mantine/core";

import Button from "../../Button";
import PageCenter from "../PageCenter";

export type PageErrorProps = {
  illustration?: string;
  error: string;
  children?: React.ReactNode;
};

const PageError: React.FC<PageErrorProps> = ({
  error,
  illustration,
  children,
}) => {
  const router = useRouter();
  return (
    <PageCenter>
      <Flex direction="column" align="center" gap="lg">
        {children}
        {illustration && (
          <Image width={250} src={illustration} alt="Not found" />
        )}
        <Stack>
          <Text align="center" color="cGray.7">
            {error}
          </Text>
          <Button onClick={() => router.back()}>Volver</Button>
        </Stack>
      </Flex>
    </PageCenter>
  );
};

export default PageError;

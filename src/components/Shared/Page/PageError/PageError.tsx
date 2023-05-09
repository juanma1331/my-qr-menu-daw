import Image from "next/image";
import { Flex, Stack, Text } from "@mantine/core";

import ButtonLink from "../../ButtonLink";
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
          <ButtonLink to="/">Volver</ButtonLink>
        </Stack>
      </Flex>
    </PageCenter>
  );
};

export default PageError;

import type { ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Loader,
  Paper,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { IconPlus } from "@tabler/icons-react";

import { api } from "~/utils/api";
import type { WithAuthentication } from "../../../../components/Auth/AuthGuard";
import MenuLayout from "../../../../components/Layout/MenuLayout";
import ProductsTable from "../../../../components/Menus/Menu/Products/ProductsTable";
import PageCenter from "../../../../components/Shared/PageCenter";
import PageError from "../../../../components/Shared/PageError";
import PublishButton from "../../../../components/Shared/PublishButton";
import type { NextPageWithLayout } from "../../../_app";

const ProductsPage: WithAuthentication<NextPageWithLayout> = () => {
  const router = useRouter();
  const menuId = router.query.menuId as string;
  const utils = api.useContext();

  const { data, isLoading, isError } =
    api.menus.getProductsWithSections.useQuery({ menuId });

  const createVersionWithoutDeletedProductMutation =
    api.menus.createVersionWithoutDeletedProduct.useMutation({
      onSuccess: async () => {
        await utils.menus.getProductsWithSections.invalidate();

        await utils.menus.getMenusInfo.invalidate();

        await router.push(`/menus/${menuId}/products`);
      },
      onError: (e) => console.log(e),
    });

  const openDeleteModal = (id: number) => {
    return openConfirmModal({
      centered: true,
      title: "Borrar Menú",
      children: (
        <Text size="sm">
          Está seguro que desea borrar este producto? Esta acción no se puede
          deshacer.
        </Text>
      ),
      labels: { confirm: "Borrar", cancel: "Cancelar" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        createVersionWithoutDeletedProductMutation.mutate({
          menuId,
          productId: id,
        });
      },
    });
  };

  if (isLoading || createVersionWithoutDeletedProductMutation.isLoading)
    return (
      <PageCenter h="100vh">
        <Loader />
      </PageCenter>
    );

  if (isError) {
    return (
      <PageCenter h="100vh">
        <PageError>
          <Stack>
            <Text>
              Lamentablemente no pudimos obtener los productos del menú debido a
              un problema interno
            </Text>
            <Button component={Link} href="/menus">
              Volver
            </Button>
          </Stack>
        </PageError>
      </PageCenter>
    );
  }

  return (
    <>
      <Paper p="sm" shadow="sm">
        <Flex justify="end">
          <Group position="apart" style={{ width: "100%" }}>
            <PublishButton
              published={data.isPublic}
              onClick={() => console.log("publishing")}
            />
          </Group>
        </Flex>
      </Paper>

      <Space h="sm" />

      <Paper p="sm" pb="lg" shadow="sm">
        <Group position="apart">
          <Title order={2}>Productos</Title>

          <ActionIcon
            color="blue"
            component={Link}
            href={`/menus/${menuId}/products/new`}
          >
            <IconPlus color="gray" size={20} />
          </ActionIcon>
        </Group>

        <Space h="xs" />

        <ProductsTable
          products={data.products}
          onDelete={(productId: number) => {
            openDeleteModal(productId);
          }}
        />
      </Paper>
    </>
  );
};

ProductsPage.getLayout = (page: ReactElement) => {
  return <MenuLayout>{page}</MenuLayout>;
};

ProductsPage.auth = {
  role: "user",
  loading: <div>Loading Session...</div>,
};

export default ProductsPage;

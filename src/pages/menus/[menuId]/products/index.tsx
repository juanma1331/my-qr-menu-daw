import { useState, type ReactElement } from "react";
import { useRouter } from "next/router";
import { Group, Paper, Space } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

import { api } from "~/utils/api";
import Button from "~/components/Shared/Button";
import GenericPageError from "~/components/Shared/Page/PageError/GenericPageError";
import PageLoader from "~/components/Shared/Page/PageLoader";
import PageSectionTitle from "~/components/Shared/Page/PageSectionTitle";
import { openDeleteConfirmModal } from "~/components/confirmation-modals";
import { notificateSuccess } from "~/components/notifications";
import EmptyProductsTable from "~/components/pages/ProductsPage/EmptyProductsTable";
import type { WithAuthentication } from "../../../../components/Auth/AuthGuard";
import MenuLayout from "../../../../components/Layout/MenuLayout/MenuLayout";
import PublishButton from "../../../../components/Shared/PublishButton";
import ProductsTable from "../../../../components/pages/ProductsPage/ProductsTable/ProductsTable";
import type { NextPageWithLayout } from "../../../_app";

const ProductsPage: WithAuthentication<NextPageWithLayout> = () => {
  const router = useRouter();
  const menuId = router.query.menuId as string;
  const utils = api.useContext();
  const [publishError, setPublishError] = useState(false);

  const { data, isLoading, isError } =
    api.menus.getProductsWithSections.useQuery({ menuId });

  const createVersionWithoutDeletedProductMutation =
    api.menus.createVersionWithoutDeletedProduct.useMutation({
      onSuccess: async () => {
        await utils.menus.invalidate();

        await router.push(`/menus/${menuId}/products`);

        notificateSuccess({
          title: "Producto borrado",
          message: "El producto fue borrado exitosamente",
        });
      },
      onError: (e) => console.log(e),
    });

  //  Está seguro que desea borrar este producto? Esta acción no se puede deshacer. Borrar Producto
  const openDeleteModal = (id: number) => {
    return openDeleteConfirmModal({
      title: "Borrar Producto",
      body: "Está seguro que desea borrar este producto? Esta acción no se puede deshacer",
      onConfirmDelete: () => {
        createVersionWithoutDeletedProductMutation.mutate({
          menuId,
          productId: id,
        });
      },
    });
  };

  if (isLoading || createVersionWithoutDeletedProductMutation.isLoading)
    return <PageLoader />;

  if (isError) {
    return (
      <GenericPageError
        error="Lamentablemente no pudimos obtener los productos del menú debido a
      un problema interno"
      />
    );
  }

  if (publishError) {
    return (
      <GenericPageError error="Lamentablemente no pudimos publicar el menú debido a un problema interno" />
    );
  }

  return (
    <Paper p="sm" pb="lg" shadow="sm">
      <Group position="apart">
        <PageSectionTitle order={2}>Productos</PageSectionTitle>
        <PublishButton
          published={data.isPublic}
          menuId={menuId}
          onInternalError={() => setPublishError(true)}
        />
      </Group>

      <Space h="lg" />

      <Group position="center">
        <Button
          vr="neutral"
          size="sm"
          rightIcon={<IconPlus size={16} />}
          onClick={async () =>
            await router.push(`/menus/${menuId}/products/new`)
          }
        >
          Nuevo Producto
        </Button>
      </Group>

      <Space h="lg" />

      {data.products.length > 0 ? (
        <ProductsTable
          products={data.products}
          onDelete={(productId: number) => {
            openDeleteModal(productId);
          }}
          onEdit={async (productId: number) => {
            await router.push(`/menus/${menuId}/products/${productId}/edit`);
          }}
        />
      ) : (
        <EmptyProductsTable />
      )}
    </Paper>
  );
};

ProductsPage.getLayout = (page: ReactElement) => {
  return <MenuLayout>{page}</MenuLayout>;
};

ProductsPage.auth = {
  role: "USER",
  loading: <div>Loading Session...</div>,
};

export default ProductsPage;

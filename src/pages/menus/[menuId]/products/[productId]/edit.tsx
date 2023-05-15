import { useState, type ReactElement } from "react";
import { useRouter } from "next/router";
import { Paper, Space } from "@mantine/core";

import { api } from "~/utils/api";
import { serializeFile } from "~/utils/client";
import GenericPageError from "~/components/Shared/Page/PageError/GenericPageError";
import PageLoader from "~/components/Shared/Page/PageLoader";
import PageSectionTitle from "~/components/Shared/Page/PageSectionTitle";
import { notificateSuccess } from "~/components/notifications";
import EditProductForm, {
  type EditProductFormValues,
} from "~/components/pages/EditProductPage/EditProductForm";
import type { WithAuthentication } from "../../../../../components/Auth/AuthGuard";
import MenuLayout from "../../../../../components/Layout/MenuLayout/MenuLayout";
import type { NextPageWithLayout } from "../../../../_app";

const EditProductPage: WithAuthentication<NextPageWithLayout> = ({}) => {
  const router = useRouter();
  const menuId = router.query.menuId as string;
  const productId = router.query.productId as string;
  const [editError, setEditError] = useState(false);
  const utils = api.useContext();

  const {
    data: sectionsData,
    isLoading: sectionsDataLoading,
    error: sectionsDataError,
  } = api.menus.getSectionsWithoutProducts.useQuery({
    menuId,
  });

  const {
    data: productData,
    isLoading: productDataLoading,
    error: productDataError,
  } = api.menus.getProduct.useQuery({
    id: parseInt(productId, 10),
  });

  const createVersionWithEditedProductMutation =
    api.menus.createVersionWithEditedProduct.useMutation({
      onSuccess: async () => {
        await utils.menus.invalidate();

        notificateSuccess({
          title: "Producto editado",
          message: "El producto fue editado exitosamente",
        });

        await router.push(`/menus/${menuId}/products`);
      },
      onError: () => setEditError(true),
    });

  const handleOnSubmit = async ({
    product,
    sectionId,
    image,
  }: EditProductFormValues) => {
    if (!productData) return;

    const serializedImage = image ? await serializeFile(image) : null;
    const editedProduct = {
      ...product,
      image: serializedImage,
      id: productData.product.id,
      currentImageId: productData.product.imageId,
    };

    createVersionWithEditedProductMutation.mutate({
      menuId,
      sectionId,
      product: editedProduct,
    });
  };

  if (
    sectionsDataLoading ||
    productDataLoading ||
    createVersionWithEditedProductMutation.isLoading
  ) {
    return <PageLoader />;
  }

  if (sectionsDataError || productDataError || !sectionsData || !productData) {
    return (
      <GenericPageError error="Lamentablemente no pudimos obtener la información del servidor" />
    );
  }

  if (editError) {
    setEditError(false);
    return (
      <GenericPageError error="Lamentablemente no pudimos editar el producto" />
    );
  }

  return (
    <Paper p="sm" pb="lg" shadow="sm">
      <PageSectionTitle order={2}>Editar Producto</PageSectionTitle>

      <Space h="xs" />

      <EditProductForm
        onSubmit={handleOnSubmit}
        sections={sectionsData.sections}
        productData={productData}
      />
    </Paper>
  );
};

EditProductPage.getLayout = (page: ReactElement) => {
  return <MenuLayout>{page}</MenuLayout>;
};

EditProductPage.auth = {
  role: "USER",
  loading: <PageLoader />,
};

export default EditProductPage;

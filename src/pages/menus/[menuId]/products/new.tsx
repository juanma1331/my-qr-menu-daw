import { type ReactElement } from "react";
import { useRouter } from "next/router";
import { Paper, Space } from "@mantine/core";

import { api } from "~/utils/api";
import { serializeFile } from "~/utils/client";
import ButtonLink from "~/components/Shared/ButtonLink";
import ErrorAlert from "~/components/Shared/ErrorAlert";
import GenericPageError from "~/components/Shared/Page/PageError/GenericPageError";
import PageLoader from "~/components/Shared/Page/PageLoader";
import PageSectionTitle from "~/components/Shared/Page/PageSectionTitle";
import { notificateSuccess } from "~/components/notifications";
import type { WithAuthentication } from "../../../../components/Auth/AuthGuard";
import MenuLayout from "../../../../components/Layout/MenuLayout/MenuLayout";
import NewProductForm, {
  type NewProductFormValues,
} from "../../../../components/pages/NewProductPage/NewProductForm";
import type { NextPageWithLayout } from "../../../_app";

const NewProductPage: WithAuthentication<NextPageWithLayout> = ({}) => {
  const router = useRouter();
  const menuId = router.query.menuId as string;
  const utils = api.useContext();

  const {
    data: sectionsData,
    isLoading: sectionsIsLoading,
    error: sectionsError,
  } = api.menus.getSectionsWithoutProducts.useQuery({ menuId });

  const createVersionWithNewProductMutation =
    api.menus.createVersionWithNewProduct.useMutation({
      onSuccess: async () => {
        await utils.menus.invalidate();

        notificateSuccess({
          title: "Producto creado",
          message: "El producto se ha creado con éxito",
        });

        await router.push(`/menus/${menuId}/products`);
      },
    });

  const handleOnSubmitNewProduct = async (
    newProductData: NewProductFormValues,
  ) => {
    const serializedImage = await serializeFile(newProductData.product.image);

    if (!serializedImage) {
      throw new Error("No se pudo serializar la imagen");
    }

    createVersionWithNewProductMutation.mutate({
      menuId,
      sectionId: newProductData.sectionId,
      product: {
        ...newProductData.product,
        image: serializedImage,
      },
    });
  };

  if (sectionsIsLoading || createVersionWithNewProductMutation.isLoading)
    return <PageLoader />;

  if (sectionsError) {
    return (
      <GenericPageError
        error="Lamentablemente no pudimos obtener las secciones del menú debido a
      un problema interno"
      />
    );
  }

  if (sectionsData && sectionsData.sections.length === 0) {
    return (
      <ErrorAlert>
        El menú no tiene secciones debes agregar al menos una.
        <ButtonLink
          ml="lg"
          size="xs"
          color="cEmerald.5"
          to={`/menus/${menuId}/sections`}
        >
          Añadir Sección
        </ButtonLink>
      </ErrorAlert>
    );
  }

  return (
    <Paper p="sm" pb="lg" shadow="sm">
      <PageSectionTitle order={2}>Nuevo Producto</PageSectionTitle>

      <Space h="lg" />

      <NewProductForm
        onSubmit={handleOnSubmitNewProduct}
        sections={sectionsData.sections}
      />
    </Paper>
  );
};

NewProductPage.getLayout = (page: ReactElement) => {
  return <MenuLayout>{page}</MenuLayout>;
};

NewProductPage.auth = {
  role: "USER",
  loading: <div>Loading Session...</div>,
};

export default NewProductPage;

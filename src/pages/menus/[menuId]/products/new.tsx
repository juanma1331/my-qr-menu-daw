import type { ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Button,
  Loader,
  Paper,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import { api } from "~/utils/api";
import { serializeFile } from "~/utils/client";
import type { WithAuthentication } from "../../../../components/Auth/AuthGuard";
import MenuLayout from "../../../../components/Layout/MenuLayout";
import NewProductForm, {
  type NewProductFormValues,
} from "../../../../components/Menus/Menu/Products/NewProductForm";
import PageCenter from "../../../../components/Shared/PageCenter";
import PageError from "../../../../components/Shared/PageError";
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
        await utils.menus.getProductsWithSections.invalidate({
          menuId,
        });

        await utils.menus.getSectionsWithoutProducts.invalidate({
          menuId,
        });

        await utils.menus.getMenusInfo.invalidate();

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

  if (sectionsIsLoading)
    return (
      <PageCenter h="100vh">
        <Loader />
      </PageCenter>
    );

  if (sectionsError) {
    return (
      <PageCenter h="100vh">
        <PageError>
          <Stack>
            <Text>
              Lamentablemente no pudimos obtener las secciones del menú debido a
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

  if (sectionsData.sections.length === 0) {
    return (
      <PageCenter h="100vh">
        <PageError>
          <Stack>
            <Text>
              El menú aún no tiene secciones, por favor crea una sección antes
              de crear un producto
            </Text>
            <Button component={Link} href={`/menus/${menuId}/sections`}>
              Volver
            </Button>
          </Stack>
        </PageError>
      </PageCenter>
    );
  }

  return (
    <Paper p="sm" pb="lg" shadow="sm">
      <Title order={2}>Nuevo Producto</Title>
      <Space h="xs" />
      <NewProductForm
        onSubmit={handleOnSubmitNewProduct}
        sections={sectionsData.sections}
        isLoading={createVersionWithNewProductMutation.isLoading}
      />
    </Paper>
  );
};

NewProductPage.getLayout = (page: ReactElement) => {
  return <MenuLayout>{page}</MenuLayout>;
};

NewProductPage.auth = {
  role: "user",
  loading: <div>Loading Session...</div>,
};

export default NewProductPage;

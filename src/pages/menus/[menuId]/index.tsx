import { useState, type ReactElement } from "react";
import { useRouter } from "next/router";
import { Group, Paper, Space } from "@mantine/core";

import { api } from "~/utils/api";
import { serializeFile } from "~/utils/client";
import GenericPageError from "~/components/Shared/Page/PageError/GenericPageError";
import PageLoader from "~/components/Shared/Page/PageLoader";
import PageSectionTitle from "~/components/Shared/Page/PageSectionTitle";
import { notificateSuccess } from "~/components/notifications";
import EditPropertiesForm from "~/components/pages/PropertiesPage/EditPropertiesForm";
import type { EditPropertiesFormValues } from "~/components/pages/PropertiesPage/EditPropertiesFormContext";
import type { WithAuthentication } from "../../../components/Auth/AuthGuard";
import MenuLayout from "../../../components/Layout/MenuLayout/MenuLayout";
import PublishButton from "../../../components/Shared/PublishButton";
import type { NextPageWithLayout } from "../../_app";

const MenuPage: WithAuthentication<NextPageWithLayout> = () => {
  const router = useRouter();
  const utils = api.useContext();
  const menuId = router.query.menuId as string;
  const [publishError, setPublishError] = useState(false);

  const { data, isLoading, isError } = api.menus.getMenuProperties.useQuery(
    {
      menuId,
    },
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      cacheTime: 5000,
    },
  );

  const createVersionWithNewPropertiesMutation =
    api.menus.createVersionWithNewProperties.useMutation({
      onSuccess: async (newProperties) => {
        utils.menus.getMenuProperties.setData({ menuId }, newProperties);

        await utils.menus.invalidate();

        notificateSuccess({
          title: "Propiedades actualizadas",
          message: "Las propiedades del menú se actualizaron correctamente",
        });
      },
    });

  const handleOnEdit = async (newProperties: EditPropertiesFormValues) => {
    createVersionWithNewPropertiesMutation.mutate({
      menuId: menuId,
      properties: {
        title: newProperties.title,
        subtitle: newProperties.subtitle,
        image: await serializeFile(newProperties.image),
        deleteImage: newProperties.deleteImage,
      },
    });
  };

  if (isLoading || createVersionWithNewPropertiesMutation.isLoading)
    return <PageLoader />;

  if (isError) {
    return (
      <GenericPageError
        error="Lamentablemente no pudimos obtener las propiedades principales del menú
      debido a un problema interno"
      />
    );
  }

  if (createVersionWithNewPropertiesMutation.isError) {
    return (
      <GenericPageError
        error="Lamentablemente no pudimos actualizar las propiedades del menú
      debido a un problema interno"
      />
    );
  }

  if (publishError) {
    return (
      <GenericPageError error="Lamentablemente no pudimos publicar el menú debido a un problema interno" />
    );
  }

  return (
    <Paper p="sm" shadow="sm">
      <Group position="apart">
        <PageSectionTitle>Propiedades Principales</PageSectionTitle>
        <PublishButton
          published={data.properties.isPublic}
          menuId={menuId}
          onInternalError={() => setPublishError(true)}
        />
      </Group>

      <Space h="lg" />

      <EditPropertiesForm properties={data.properties} onEdit={handleOnEdit} />
    </Paper>
  );
};

MenuPage.getLayout = (page: ReactElement) => {
  return <MenuLayout>{page}</MenuLayout>;
};

MenuPage.auth = {
  role: "USER",
  loading: <PageLoader />,
};

export default MenuPage;

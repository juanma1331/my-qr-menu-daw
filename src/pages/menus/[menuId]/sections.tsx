import { useState, type ReactElement } from "react";
import { useRouter } from "next/router";
import { Group, Paper, Space } from "@mantine/core";

import { api } from "~/utils/api";
import GenericPageError from "~/components/Shared/Page/PageError/GenericPageError";
import PageLoader from "~/components/Shared/Page/PageLoader";
import PageSectionTitle from "~/components/Shared/Page/PageSectionTitle";
import PublishButton from "~/components/Shared/PublishButton";
import { notificateSuccess } from "~/components/notifications";
import type { EditSectionsFormValues } from "~/components/pages/SectionsPage/EditSectionsFormContext";
import type { WithAuthentication } from "../../../components/Auth/AuthGuard";
import MenuLayout from "../../../components/Layout/MenuLayout/MenuLayout";
import EditSectionForm from "../../../components/pages/SectionsPage/EditSectionsForm";
import type { NextPageWithLayout } from "../../_app";

const SectionsPage: WithAuthentication<NextPageWithLayout> = () => {
  const router = useRouter();
  const utils = api.useContext();
  const menuId = router.query.menuId as string;
  const [publisheError, setPublishError] = useState(false);

  const { data, isLoading, isError } =
    api.menus.getSectionsWithoutProducts.useQuery(
      {
        menuId,
      },
      { refetchOnWindowFocus: false, enabled: !!menuId },
    );

  const editLatestVersionSectionsMutation =
    api.menus.createVersionWithSections.useMutation({
      onSuccess: async () => {
        await utils.menus.invalidate();

        notificateSuccess({
          title: "Secciones actualizadas",
          message: "Las secciones se actualizaron correctamente",
        });
      },
    });

  const handleOnEdit = ({ sections }: EditSectionsFormValues) => {
    editLatestVersionSectionsMutation.mutate({
      menuId,
      sections,
    });
  };

  if (isLoading || editLatestVersionSectionsMutation.isLoading || !data)
    return <PageLoader />;

  if (isError) {
    return (
      <GenericPageError
        error="Lamentablemente no pudimos obtener la configuración del menú
      debido a un problema interno"
      />
    );
  }

  if (publisheError) {
    setPublishError(false);
    return (
      <GenericPageError error="Lamentablemente no pudimos publicar tu menú" />
    );
  }

  return (
    <>
      <Paper p="sm" pb="lg" shadow="sm">
        <Group position="apart">
          <PageSectionTitle>Secciones</PageSectionTitle>
          <PublishButton
            published={data.isPublic}
            menuId={menuId}
            onInternalError={() => setPublishError(true)}
          />
        </Group>

        <Space h="lg" />

        <EditSectionForm onEdit={handleOnEdit} sections={data.sections} />
      </Paper>
    </>
  );
};

SectionsPage.getLayout = (page: ReactElement) => {
  return <MenuLayout>{page}</MenuLayout>;
};

SectionsPage.auth = {
  role: "USER",
  loading: <PageLoader />,
};

export default SectionsPage;

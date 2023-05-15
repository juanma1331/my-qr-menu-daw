import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Box } from "@mantine/core";

import { api } from "~/utils/api";
import GenericPageError from "~/components/Shared/Page/PageError/GenericPageError";
import NotFoundPageError from "~/components/Shared/Page/PageError/NotFoundPageError";
import PageLoader from "~/components/Shared/Page/PageLoader";
import Version from "~/components/Shared/Version/Version";

const PublicMenuPage: NextPage = () => {
  const router = useRouter();
  const menuId = router.query.menuId as string;

  const {
    data: versionData,
    isLoading: isVersionDataLoading,
    isError: isVersionDataError,
  } = api.menus.getPublicVersion.useQuery({ menuId }, { enabled: !!menuId });

  if (isVersionDataLoading) return <PageLoader />;

  if (isVersionDataError) {
    return (
      <GenericPageError error="No pudimos obtener la información del menú debido a un problema interno" />
    );
  }

  if (!versionData.version) {
    return (
      <NotFoundPageError error="No pudimos encontrar el menú que estás buscando" />
    );
  }

  return (
    <Box
      sx={() => ({
        minHeight: "100vh",
        height: "100%",
        position: "relative",
      })}
    >
      <Version version={versionData.version} />
    </Box>
  );
};

export default PublicMenuPage;

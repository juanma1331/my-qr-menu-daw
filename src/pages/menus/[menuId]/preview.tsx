import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Badge, Box } from "@mantine/core";
import { IconArrowBackUp } from "@tabler/icons-react";

import { api } from "~/utils/api";
import type { WithAuthentication } from "~/components/Auth/AuthGuard";
import Footer from "~/components/Layout/Footer";
import Button from "~/components/Shared/Button";
import GenericPageError from "~/components/Shared/Page/PageError/GenericPageError";
import PageLoader from "~/components/Shared/Page/PageLoader";
import Version from "~/components/Shared/Version/Version";

const PreviewPage: WithAuthentication<NextPage> = () => {
  const router = useRouter();
  const menuId = router.query.menuId as string;

  const {
    data: versionData,
    isLoading: isVersionDataLoading,
    isError: isVersionDataError,
  } = api.menus.getVersionForPreview.useQuery(
    { menuId },
    {
      refetchOnWindowFocus: false,
      enabled: !!menuId,
    },
  );

  if (isVersionDataLoading) return <PageLoader />;

  if (isVersionDataError) {
    return (
      <GenericPageError error="No pudimos obtener la información del menú debido a un problema interno" />
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
      <Version
        version={versionData.version}
        top={
          <>
            <Badge variant="outline" color="cEmerald.4">
              Preview
            </Badge>
            <Button
              style={{ color: "white" }}
              variant="outline"
              rightIcon={<IconArrowBackUp size={16} />}
              onClick={() => router.back()}
            >
              Volver
            </Button>
          </>
        }
      />

      <Footer
        style={{
          position: "sticky",
          top: "95.8%",
          bottom: 0,
          zIndex: 3,
        }}
      />
    </Box>
  );
};

PreviewPage.auth = {
  role: "USER",
  loading: <PageLoader />,
};

export default PreviewPage;

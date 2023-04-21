import { useState, type ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Button,
  Flex,
  Group,
  Loader,
  Paper,
  Space,
  Stack,
  Switch,
  Text,
} from "@mantine/core";

import { api } from "~/utils/api";
import type { WithAuthentication } from "../../../components/Auth/AuthGuard";
import MenuLayout from "../../../components/Layout/MenuLayout";
import EditSectionForm from "../../../components/Menus/Menu/Sections/EditSectionsForm";
import type { EditSectionsFormValues } from "../../../components/Menus/Menu/Sections/EditSectionsFormContext";
import PageCenter from "../../../components/Shared/PageCenter";
import PageError from "../../../components/Shared/PageError";
import PublishButton from "../../../components/Shared/PublishButton";
import type { NextPageWithLayout } from "../../_app";

const SectionsPage: WithAuthentication<NextPageWithLayout> = () => {
  const router = useRouter();
  const utils = api.useContext();
  const menuId = router.query.menuId as string;
  const [editMode, setEditMode] = useState(false);

  const { data, isLoading, isError } =
    api.menus.getSectionsWithoutProducts.useQuery(
      {
        menuId,
      },
      {
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        cacheTime: 5000,
      },
    );

  const editLatestVersionSectionsMutation =
    trpc.menus.createVersionWithSections.useMutation({
      onSuccess: (newSectionsData) => {
        utils.menus.getSectionsWithoutProducts.setData(newSectionsData, {
          menuId,
        });
      },
    });

  const handleOnEdit = async ({ sections }: EditSectionsFormValues) => {
    const cachedSections = utils.menus.getSectionsWithoutProducts.getData({
      menuId,
    });

    if (!cachedSections) {
      throw new Error("No cached sections");
    }

    editLatestVersionSectionsMutation.mutate({
      menuId,
      sections,
    });
  };

  if (isLoading || editLatestVersionSectionsMutation.isLoading)
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
              Lamentablemente no pudimos obtener la configuración del menú
              debido a un problema interno
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
            <Switch
              label="Editar"
              checked={editMode}
              onChange={() => setEditMode((prev) => !prev)}
            />
          </Group>
        </Flex>
      </Paper>

      <Space h="sm" />

      <Paper p="sm" pb="lg" shadow="sm">
        <EditSectionForm
          editMode={editMode}
          onEdit={handleOnEdit}
          sections={data.sections}
        />
      </Paper>
    </>
  );
};

SectionsPage.getLayout = (page: ReactElement) => {
  return <MenuLayout>{page}</MenuLayout>;
};

SectionsPage.auth = {
  role: "user",
  loading: <div>Loading Session...</div>,
};

export default SectionsPage;

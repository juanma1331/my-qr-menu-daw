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
  Title,
} from "@mantine/core";

import { api } from "~/utils/api";
import { serializeFile } from "~/utils/client";
import EditPropertiesForm, {
  type EditPropertiesFormValues,
} from "~/components/Menus/Menu/Properties/EditPropertiesForm";
import type { WithAuthentication } from "../../../components/Auth/AuthGuard";
import MenuLayout from "../../../components/Layout/MenuLayout";
import PageCenter from "../../../components/Shared/PageCenter";
import PageError from "../../../components/Shared/PageError";
import PublishButton from "../../../components/Shared/PublishButton";
import type { NextPageWithLayout } from "../../_app";

const MenuPage: WithAuthentication<NextPageWithLayout> = () => {
  const router = useRouter();
  const utils = api.useContext();
  const menuId = router.query.menuId as string;
  const [editMode, setEditMode] = useState(false);

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

  const createVersionWithNewProperties =
    api.menus.createVersionWithNewProperties.useMutation({
      onSuccess: (newProperties) => {
        utils.menus.getMenuProperties.setData({ menuId }, newProperties);
      },
    });

  const handleOnEdit = async ({ properties }: EditPropertiesFormValues) => {
    const cachedProperties = utils.menus.getMenuProperties.getData({
      menuId,
    });

    console.log("called");

    if (!cachedProperties) return; // TODO: Manejar error

    createVersionWithNewProperties.mutate({
      menuId: menuId,
      properties: {
        title: properties.title,
        subtitle: properties.subtitle,
        image: await serializeFile(properties.image),
        deleteImage: properties.deleteImage,
      },
    });
  };

  if (isLoading || createVersionWithNewProperties.isLoading)
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
              published={data.properties.isPublic}
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

      <Paper p="sm" shadow="sm">
        <Title order={2}>Propiedades Principales</Title>

        <Space h="xs" />

        <EditPropertiesForm
          properties={data.properties}
          editMode={true}
          onEdit={handleOnEdit}
        />
      </Paper>
    </>
  );
};

MenuPage.getLayout = (page: ReactElement) => {
  return <MenuLayout>{page}</MenuLayout>;
};

MenuPage.auth = {
  role: "user",
  loading: <div>Loading Session...</div>,
};

export default MenuPage;

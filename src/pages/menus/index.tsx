import { useState, type ReactElement } from "react";
import { useRouter } from "next/router";
import { Box, Flex, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

import { api } from "~/utils/api";
import MenusLayout from "~/components/Layout/MenusLayout";
import Button from "~/components/Shared/Button";
import Modal from "~/components/Shared/Modal";
import PageEmptyList from "~/components/Shared/Page/PageEmptyList";
import GenericPageError from "~/components/Shared/Page/PageError/GenericPageError";
import PageLoader from "~/components/Shared/Page/PageLoader";
import PageSectionTitle from "~/components/Shared/Page/PageSectionTitle";
import { openDeleteConfirmModal } from "~/components/confirmation-modals";
import { notificateError, notificateSuccess } from "~/components/notifications";
import NewMenuForm, {
  type NewMenu,
} from "~/components/pages/MenusPage/NewMenuForm";
import type { WithAuthentication } from "../../components/Auth/AuthGuard";
import MenusGrid from "../../components/pages/MenusPage/Grid/MenusGrid";
import type { NextPageWithLayout } from "../_app";

const MenusPage: WithAuthentication<NextPageWithLayout> = () => {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [deletionError, setDeletionError] = useState(false);
  const [creationError, setCreationError] = useState(false);
  const {
    data,
    refetch,
    isLoading: menusLoading,
    isError: menusError,
  } = api.menus.getMenusInfo.useQuery();

  const createMenuAndVersionMutation =
    api.menus.createMenuAndVersion.useMutation({
      onSuccess: async (data) => {
        if (data.creationStatus === "allowed") {
          await router.push(`/menus/${data.menuId}`);
        } else {
          close();
          notificateError({
            title: "Límite alcanzado",
            message:
              "No se pudo crear el menú debido a que alcanzaste el límite de menús permitidos.",
          });
        }
      },
      onError: () => {
        setCreationError(true);
      },
    });

  const deleteMenuMutation = api.menus.deleteMenu.useMutation({
    onSuccess: async () => {
      await refetch();
      notificateSuccess({
        title: "Menú borrado",
        message: "El menú fue borrado exitosamente.",
      });
    },
    onError: () => {
      setDeletionError(true);
    },
  });
  const openDeleteModal = (id: string) => {
    return openDeleteConfirmModal({
      title: "Borrar Menú",
      body: "Si borra el menú perderá toda la información relativa a ese menú.",
      onConfirmDelete: () => deleteMenuMutation.mutate({ menuId: id }),
    });
  };

  const handleOnNewMenu = (menu: NewMenu) => {
    createMenuAndVersionMutation.mutate(menu);
  };

  if (
    menusLoading ||
    createMenuAndVersionMutation.isLoading ||
    deleteMenuMutation.isLoading
  )
    return <PageLoader />;

  if (menusError)
    return (
      <GenericPageError
        error="Lamentablemente no pudimos obtener tus menús debido a un problema
      interno"
      />
    );

  if (deletionError) {
    return (
      <GenericPageError
        error="Lamentablemente no pudimos borrar tu menú debido a un problema
    interno"
      />
    );
  }

  if (creationError) {
    return (
      <GenericPageError error="Lamentablemente no pudimos crear tu menú debido a un problema interno" />
    );
  }

  return (
    <>
      <Stack h="100%">
        <Flex justify="flex-end">
          <Button onClick={open} rightIcon={<IconPlus size={16} />}>
            Nuevo Menú
          </Button>
        </Flex>

        <Box h="100%">
          <PageSectionTitle>Mis Menús</PageSectionTitle>
          {data.menus.length > 0 ? (
            <MenusGrid
              menus={data.menus}
              onRemove={(menuId: string) => {
                openDeleteModal(menuId);
              }}
            />
          ) : (
            <PageEmptyList
              text="Actualmente no tienes ningún menú. "
              action={
                <Button size="xs" variant="outline" onClick={open}>
                  Nuevo Menú
                </Button>
              }
            />
          )}
        </Box>
      </Stack>

      <Modal opened={opened} onClose={close} title="Nuevo Menú">
        <NewMenuForm onNew={handleOnNewMenu} />
      </Modal>
    </>
  );
};

MenusPage.getLayout = (page: ReactElement) => {
  return <MenusLayout>{page}</MenusLayout>;
};

MenusPage.auth = {
  role: "USER",
  loading: <PageLoader />,
};

export default MenusPage;

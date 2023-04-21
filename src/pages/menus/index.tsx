import { useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Button,
  Container,
  Flex,
  Loader,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { openConfirmModal } from "@mantine/modals";

import { api } from "~/utils/api";
import NewMenuForm, { type NewMenu } from "~/components/Menus/NewMenuForm";
import type { WithAuthentication } from "../../components/Auth/AuthGuard";
import Menus from "../../components/Menus/Menus";
import MenusHeader from "../../components/Menus/MenusHeader";
import PageCenter from "../../components/Shared/PageCenter";
import PageError from "../../components/Shared/PageError";

const MenusPage: WithAuthentication<NextPage> = () => {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const utils = api.useContext();
  const [creationLimitReached, setCreationLimitReached] = useState(false);
  const [deletionError, setDeletionError] = useState(false);
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
          setCreationLimitReached(true);
        }
      },
      onError: (error) => {
        console.log(error);
      },
    });

  const deleteMenuMutation = api.menus.deleteMenu.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });

  const openDeleteModal = (id: string) => {
    return openConfirmModal({
      centered: true,
      title: "Borrar Menú",
      children: (
        <Text size="sm">
          Si borra el menú perderá toda la información relative a ese menú.
        </Text>
      ),
      labels: { confirm: "Borrar", cancel: "Cancelar" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        deleteMenuMutation.mutate({
          menuId: id,
        });
      },
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
    return (
      <>
        <MenusHeader />

        <PageCenter h="100vh">
          <Loader />
        </PageCenter>
      </>
    );

  if (menusError || !data)
    return (
      <>
        <MenusHeader />
        <PageCenter h="100vh">
          <PageError>
            <Stack>
              <Text>
                Lamentablemente no pudimos obtener tus menús debido a un
                problema interno
              </Text>
              <Button component={Link} href="/menus">
                Intentar de nuevo
              </Button>
            </Stack>
          </PageError>
        </PageCenter>
      </>
    );

  if (deletionError) {
    return (
      <>
        <MenusHeader />
        <PageCenter h="100vh">
          <PageError>
            <Stack>
              <Text>
                Lamentablemente no pudimos borrar tu menús debido a un problema
                interno
              </Text>
              <Button onClick={() => console.log("go back or try again")}>
                Volver
              </Button>
            </Stack>
          </PageError>
        </PageCenter>
      </>
    );
  }

  return (
    <>
      <MenusHeader />
      <Container mt="sm">
        <Stack>
          <Flex justify="flex-end">
            <Button onClick={open}>Nuevo Menú</Button>
          </Flex>
          <Menus
            menus={data.menus}
            onRemove={(menuId: string) => {
              openDeleteModal(menuId);
            }}
          />
        </Stack>
      </Container>

      <Modal opened={opened} onClose={close} title="Nuevo Menú">
        <NewMenuForm onNew={handleOnNewMenu} />
      </Modal>
    </>
  );
};

MenusPage.auth = {
  role: "user",
  loading: <div>Loading Session</div>,
};

export default MenusPage;

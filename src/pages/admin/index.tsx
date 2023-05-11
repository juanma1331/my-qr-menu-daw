import { useState, type ReactElement } from "react";
import { Paper, Space } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { api, type RouterOutputs } from "~/utils/api";
import type { WithAuthentication } from "~/components/Auth/AuthGuard";
import AdminLayout from "~/components/Layout/AdminLayout";
import Modal from "~/components/Shared/Modal";
import GenericPageError from "~/components/Shared/Page/PageError/GenericPageError";
import PageLoader from "~/components/Shared/Page/PageLoader";
import PageSectionTitle from "~/components/Shared/Page/PageSectionTitle";
import { notificateSuccess } from "~/components/notifications";
import MenuCreationLimitForm, {
  type MenuCreationLimitFormValues,
} from "~/components/pages/AdminPage/MenuCreationLimitForm";
import UsersTable from "~/components/pages/AdminPage/UsersTable";
import type { NextPageWithLayout } from "../_app";

export type EditMenuCreationLimitResponse =
  RouterOutputs["menus"]["editUserMenuCreationLimit"];

const UsersPage: WithAuthentication<NextPageWithLayout> = ({}) => {
  const utils = api.useContext();
  const [opened, { open, close }] = useDisclosure(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [currentLimit, setCurrentLimit] = useState<number | null>(null);
  const [editMenuCreationLimitError, setEditMenuCreationLimitError] =
    useState<boolean>(false);

  const {
    data: usersData,
    isLoading: usersDataLoading,
    error: usersDataError,
  } = api.menus.getUsersInfo.useQuery();

  const editUserMenuCreationLimitMutation =
    api.menus.editUserMenuCreationLimit.useMutation({
      onSuccess: ({ updatedUser }: EditMenuCreationLimitResponse) => {
        utils.menus.getUsersInfo.setData(undefined, (prev) => {
          if (prev) {
            const newUsers = prev.users.map((user) => {
              if (user.id === updatedUser.id) {
                return updatedUser;
              }
              return user;
            });
            return { ...prev, users: newUsers };
          }
        });

        notificateSuccess({
          title: "Límite de creación actualizado",
          message: `El límite de creación del usuario ${updatedUser.id} ha sido actualizado`,
        });
      },
      onError: () => {
        setEditMenuCreationLimitError(true);
      },
    });

  const onSubmitNewLimit = (formValues: MenuCreationLimitFormValues) => {
    if (!editUserId || currentLimit === null) {
      setEditMenuCreationLimitError(true);
      return;
    }

    editUserMenuCreationLimitMutation.mutate({
      userId: editUserId,
      menuCreationLimit: formValues.limit,
    });
    close();
  };

  const onEditMenuCreationLimit = (userId: string, limit: number) => {
    setEditUserId(userId);
    setCurrentLimit(limit);
    open();
  };

  if (
    !usersData ||
    usersDataLoading ||
    editUserMenuCreationLimitMutation.isLoading
  )
    return <PageLoader />;

  if (usersDataError) {
    return (
      <GenericPageError error="Lamentablemente no pudimos obtener la información de los usuarios debido a un problema interno" />
    );
  }

  if (editMenuCreationLimitError) {
    return (
      <GenericPageError error="Lamentablemente no pudimos actualizar el límite de creación del usuario debido a un problema interno" />
    );
  }

  return (
    <>
      <Paper p="sm" pb="lg" shadow="sm" maw="80%" mx="auto">
        <PageSectionTitle order={2}>Usuarios</PageSectionTitle>
        <Space h="xs" />
        <UsersTable
          users={usersData.users}
          onEditLimit={onEditMenuCreationLimit}
        />
      </Paper>

      <Modal
        opened={opened}
        onClose={close}
        title="Modificar límite de creación"
      >
        {editUserId && currentLimit !== null && (
          <MenuCreationLimitForm
            actualLimit={currentLimit}
            onSubmit={onSubmitNewLimit}
          />
        )}
      </Modal>
    </>
  );
};

UsersPage.getLayout = (page: ReactElement) => {
  return <AdminLayout>{page}</AdminLayout>;
};

UsersPage.auth = {
  role: "ADMIN",
  loading: <PageLoader />,
};

export default UsersPage;

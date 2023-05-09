import { Table } from "@mantine/core";

import type { RouterOutputs } from "~/utils/api";
import Button from "~/components/Shared/Button";

export type UsersTableProps = {
  users: RouterOutputs["menus"]["getUsersInfo"]["users"];
  onEditLimit: (userId: string, limit: number) => void;
};

const UsersTable: React.FC<UsersTableProps> = ({ users, onEditLimit }) => {
  const rows = users.map((user) => (
    <tr key={user.id}>
      <td>{user.email ?? "No proporcionado"}</td>
      <td>{user.createdMenus}</td>
      <td>{user.menuCreationLimit}</td>
      <td>
        <Button
          variant="outline"
          size="xs"
          onClick={() => onEditLimit(user.id, user.menuCreationLimit)}
        >
          Modificar
        </Button>
      </td>
    </tr>
  ));

  if (users.length === 0) {
    return (
      <Table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Menus</th>
            <th>Límite</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4}>No hay usuarios</td>
          </tr>
        </tbody>
      </Table>
    );
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Menus</th>
          <th>Límite</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default UsersTable;

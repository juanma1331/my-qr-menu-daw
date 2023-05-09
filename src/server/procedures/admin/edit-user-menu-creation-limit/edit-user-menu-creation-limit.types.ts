import type { IUser } from "../../intertaces";

export type UpdatedUser = Pick<IUser, "id" | "email" | "menuCreationLimit"> & {
  createdMenus: number;
};

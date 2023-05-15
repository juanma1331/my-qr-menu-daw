import type { IUser } from "../../interfaces";

export type UpdatedUser = Pick<IUser, "id" | "email" | "menuCreationLimit"> & {
  createdMenus: number;
};

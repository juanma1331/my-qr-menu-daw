import type { IUser } from "../../interfaces";

export type UserQuery = Pick<IUser, "id" | "email" | "menuCreationLimit"> & {
  createdMenus: number;
};

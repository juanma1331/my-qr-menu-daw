import type { IUser } from "../../intertaces";

export type UserQuery = Pick<IUser, "id" | "email" | "menuCreationLimit"> & {
  createdMenus: number;
};

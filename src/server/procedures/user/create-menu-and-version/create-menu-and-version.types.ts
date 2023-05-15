import type { IUser } from "../../interfaces";

export type UserQuery = Pick<IUser, "menuCreationLimit"> & {
  _count: { menus: number };
};

import type { IUser } from "../intertaces";

export type UserQuery = Pick<IUser, "menuCreationLimit"> & {
  _count: { menus: number };
};

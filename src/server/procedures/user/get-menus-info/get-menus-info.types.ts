import type { IMenu, IMenuVersion } from "../../interfaces";

export type MenuQuery = Pick<IMenu, "qrId"> & {
  versions: MenuVersionQuery[];
};

export type MenuVersionQuery = Pick<
  IMenuVersion,
  "title" | "isPublic" | "menuId" | "bgImageId"
> & {
  sections: SectionQuery[];
};

export type SectionQuery = {
  _count: {
    products: number;
  };
};

export type MenuInfo = {
  menuId: string;
  title: string;
  isPublic: boolean;
  sections: number;
  products: number;
  menuImage: string | null;
  qrImage: string;
};

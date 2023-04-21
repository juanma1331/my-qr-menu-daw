import type { IMenuVersion } from "~/server/procedures/intertaces";

export type MenuQuery = {
  versions: MenuVersionQuery[];
};

export type MenuVersionQuery = Pick<
  IMenuVersion,
  "title" | "isPublic" | "menuId"
> & {
  sections: SectionQuery[];
};

export type SectionQuery = {
  _count: {
    products: number;
  };
};

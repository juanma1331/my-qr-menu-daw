import type { IMenuVersion, IProduct, ISection } from "../intertaces";

export type MenuVersionQuery = Omit<
  IMenuVersion,
  "menuId" | "menu" | "sections"
> & {
  sections: SectionQuery[];
};

export type SectionQuery = Pick<ISection, "name" | "position"> & {
  products: ProductQuery[];
};

export type ProductQuery = Omit<IProduct, "id" | "section" | "sectionId">;

export type CreatedMenuVersion = Pick<
  IMenuVersion,
  "isPublic" | "title" | "subtitle" | "bgImageId"
>;

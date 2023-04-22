import type { IMenuVersion, IProduct, ISection } from "../intertaces";

export type MenuVersionQuery = Pick<
  IMenuVersion,
  "id" | "title" | "subtitle" | "isPublic" | "bgImageId"
> & {
  sections: SectionQuery[];
};

export type SectionQuery = Pick<ISection, "name" | "position"> & {
  products: ProductQuery[];
};

export type ProductQuery = Pick<
  IProduct,
  "name" | "description" | "price" | "imageId"
>;

export type CreatedMenuVersion = Pick<
  IMenuVersion,
  "isPublic" | "title" | "subtitle" | "bgImageId"
>;

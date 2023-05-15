import type { IMenuVersion, IProduct, ISection } from "../../interfaces";

export type MenuVersionQuery = Pick<
  IMenuVersion,
  "title" | "subtitle" | "bgImageId"
> & {
  sections: SectionQuery[];
};

export type SectionQuery = Pick<ISection, "name"> & {
  products: ProductQuery[];
};

export type ProductQuery = Pick<
  IProduct,
  "name" | "description" | "price" | "imageId"
>;

import type { IMenuVersion, IProduct } from "../../interfaces";

export type MenuVersionQuery = Pick<
  IMenuVersion,
  "id" | "isPublic" | "bgImageId"
> & {
  sections: SectionQuery[];
};

export type SectionQuery = {
  products: ProductQuery[];
};

export type ProductQuery = Pick<IProduct, "imageId">;

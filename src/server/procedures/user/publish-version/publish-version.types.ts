import type { IMenuVersion, IProduct } from "../../intertaces";

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

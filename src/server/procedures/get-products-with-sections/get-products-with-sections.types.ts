import { type IMenuVersion, type IProduct, type ISection } from "../intertaces";

export type MenuVersionQuery = Pick<IMenuVersion, "isPublic"> & {
  sections: SectionQuery[];
};

export type SectionQuery = {
  products: ProductQuery[];
};

export type ProductQuery = Pick<
  IProduct,
  "id" | "name" | "description" | "price" | "imageId"
> & {
  section: Pick<ISection, "id" | "name">;
};

import {
  type IMenuVersion,
  type IProduct,
  type ISection,
} from "../../interfaces";

export type MenuVersionQuery = Pick<IMenuVersion, "isPublic"> & {
  sections: SectionQuery[];
};

export type SectionQuery = {
  products: ProductQuery[];
};

export type ProductQuery = Pick<
  IProduct,
  "id" | "name" | "price" | "imageId"
> & {
  section: Pick<ISection, "id" | "name">;
};

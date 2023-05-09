import type { IMenuVersion, IProduct, ISection } from "../../intertaces";

export type MenuVersionForCreation = Pick<
  IMenuVersion,
  "title" | "subtitle" | "bgImageId"
>;

export type CreatedMenuVersion = Pick<
  IMenuVersion,
  "isPublic" | "bgImageId"
> & {
  sections: CreatedSection[];
};

export type CreatedSection = Pick<ISection, "id" | "name"> & {
  products: CreatedProduct[];
};

export type CreatedProduct = Pick<IProduct, "imageId">;

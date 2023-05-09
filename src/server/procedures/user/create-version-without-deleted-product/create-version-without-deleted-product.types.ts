import type { IMenuVersion, IProduct, ISection } from "../../intertaces";

export type NewVersionData = Pick<
  IMenuVersion,
  "title" | "subtitle" | "bgImageId"
>;

export type PreparedProduct = Pick<
  IProduct,
  "name" | "description" | "price" | "imageId"
>;

export type PreparedSection = Pick<ISection, "name" | "position"> & {
  products: {
    create: PreparedProduct[];
  };
};

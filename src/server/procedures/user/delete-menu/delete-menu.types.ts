import type { IMenu, IMenuVersion, IProduct } from "../../interfaces";

export type MenuQuery = Pick<IMenu, "qrId"> & {
  versions: MenuVersionQuery[];
};

export type MenuVersionQuery = Pick<IMenuVersion, "bgImageId"> & {
  sections: SectionQuery[];
};

export type SectionQuery = {
  products: ProductQuery[];
};

export type ProductQuery = Pick<IProduct, "imageId">;

import type { IProduct } from "../../interfaces";

export type ProductQuery = Pick<
  IProduct,
  "id" | "name" | "description" | "price" | "imageId" | "sectionId"
>;

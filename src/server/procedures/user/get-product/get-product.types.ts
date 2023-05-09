import type { IProduct } from "../../intertaces";

export type ProductQuery = Pick<
  IProduct,
  "id" | "name" | "description" | "price" | "imageId" | "sectionId"
>;

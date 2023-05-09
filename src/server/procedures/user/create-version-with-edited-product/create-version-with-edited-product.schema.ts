import { z } from "zod";

import {
  productImageSchema,
  productImageSchemaWithData,
} from "../shared/shared.schema";

const productSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre debe tener un máximo de 50 caracteres" }),
  description: z
    .string()
    .max(150, {
      message: "La descripción debe tener un máximo de 150 caracteres",
    })
    .nullable(),
  price: z.number().positive({ message: "El precio debe ser mayor a 0" }),
});

const sectionIdSchema = z
  .number()
  .positive({ message: "El id de la sección es requerido" });

export const createVersionWithEditedProductInputSchema = z.object({
  menuId: z.string(),
  sectionId: sectionIdSchema,
  product: productSchema.extend({
    id: z.number().positive({ message: "El id del producto es requerido" }),
    image: productImageSchemaWithData.nullable(),
    currentImageId: z
      .string()
      .min(1, { message: "El id de la imagen actual es requerido" }),
  }),
});

export const createVersionWithEditedProductFormSchema = z.object({
  sectionId: sectionIdSchema,
  product: productSchema.extend({
    image: productImageSchema.nullable(),
  }),
});

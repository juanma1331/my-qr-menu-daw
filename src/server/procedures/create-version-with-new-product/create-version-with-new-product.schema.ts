import { z } from "zod";

import {
  productImageSchema,
  productImageSchemaWithData,
} from "../shared/shared.schema";

const productSchema = z.object({
  name: z.string().min(1), // TODO: Add max length
  description: z.string().nullable(),
  price: z.number().positive(),
});

const sectionIdSchema = z.number().min(1, {
  message: "Section ID must be greater than 0",
});

export const createVersionWithNewProductInputSchema = z.object({
  sectionId: sectionIdSchema,
  menuId: z.string(),
  product: productSchema.extend({
    image: productImageSchemaWithData,
  }),
});

export const createVersionWithNewProductFormSchema = z.object({
  sectionId: sectionIdSchema,
  product: productSchema.extend({
    image: productImageSchema,
  }),
});

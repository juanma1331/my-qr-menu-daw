import { z } from "zod";

import { ACCEPTED_IMAGE_TYPES, PRODUCT_MAX_FILE_SIZE } from "../../constants";
import { productImageSchemaWithData } from "../shared/shared.schema";

const productSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre debe tener un máximo de 50 caracteres" }),
  description: z
    .string()
    .max(100, {
      message: "La descripción debe tener un máximo de 100 caracteres",
    })
    .nullable(),
  price: z.number().positive({ message: "El precio debe ser mayor a 0" }),
});

const sectionIdSchema = z.number().positive({ message: "Elige una sección" });

export const createVersionWithNewProductInputSchema = z.object({
  sectionId: sectionIdSchema,
  menuId: z.string(),
  product: productSchema.extend({
    image: productImageSchemaWithData,
  }),
});

export const createVersionWithNewProductFormSchema = z.object({
  sectionId: sectionIdSchema,
  product: productSchema,
  image: z
    .any()

    .refine((file) => {
      if (file) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return file.size <= PRODUCT_MAX_FILE_SIZE;
      }
    }, "El tamaño no puede superar 1mb")
    .refine(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      (file) => {
        if (file) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
          return ACCEPTED_IMAGE_TYPES.includes(file.type);
        }
      },
      "Formatos soportados .jpeg, .jpg y .png",
    )
    .refine((file) => {
      if (file === null || file === undefined) {
        return false;
      }

      return true;
    }, "El producto debe tener una imagen"),
});

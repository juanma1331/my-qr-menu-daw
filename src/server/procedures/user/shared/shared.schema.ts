import { z } from "zod";

import {
  ACCEPTED_IMAGE_TYPES,
  MENU_MAX_FILE_SIZE,
  PRODUCT_MAX_FILE_SIZE,
} from "../../constants";

const baseFileSchema = z.object({
  name: z.string().min(1, { message: "El nombre del archivo es requerido" }),
  size: z.number().positive({ message: "El tamaño del archivo es requerido" }),
  type: z.string().min(1, { message: "El tipo del archivo es requerido" }),
});

const serverFileSchema = baseFileSchema.extend({
  data: z.string(),
});

export const menuImageSchemaWithData = serverFileSchema
  .refine(
    (file) => file.size <= MENU_MAX_FILE_SIZE,
    "El tamaño no puede superar 3mb",
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Formatos soportados .jpeg, .jpg y .png",
  )
  .nullable();

export const productImageSchemaWithData = serverFileSchema
  .refine(
    (file) => file.size <= PRODUCT_MAX_FILE_SIZE,
    "El tamaño no puede superar 1mb",
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Formatos soportados .jpeg, .jpg y .png",
  );

export const menuImageSchema = baseFileSchema
  .refine(
    (file) => file.size <= MENU_MAX_FILE_SIZE,
    "El tamaño no puede superar 3mb",
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Formatos soportados .jpeg, .jpg y .png",
  )
  .nullable();

export const productImageSchema = baseFileSchema
  .refine(
    (file) => file.size <= PRODUCT_MAX_FILE_SIZE,
    "El tamaño no puede superar 1mb",
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Formatos soportados .jpeg, .jpg y .png",
  );

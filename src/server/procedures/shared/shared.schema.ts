import { z } from "zod";

import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "../constants";

const baseFileSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
});

const serverFileSchema = baseFileSchema.extend({
  data: z.string(),
});

export const menuImageSchemaWithData = serverFileSchema
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    "El tamaño no puede superar 1mb",
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Formatos soportados .jpeg, .jpg y .png",
  )
  .nullable();

export const productImageSchemaWithData = serverFileSchema
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    "El tamaño no puede superar 1mb",
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Formatos soportados .jpeg, .jpg y .png",
  );

export const menuImageSchema = baseFileSchema
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    "El tamaño no puede superar 1mb",
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Formatos soportados .jpeg, .jpg y .png",
  )
  .nullable();

export const productImageSchema = baseFileSchema
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    "El tamaño no puede superar 1mb",
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Formatos soportados .jpeg, .jpg y .png",
  );

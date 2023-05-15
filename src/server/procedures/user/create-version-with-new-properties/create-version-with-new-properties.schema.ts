import { z } from "zod";

import {
  menuImageSchema,
  menuImageSchemaWithData,
} from "../shared/shared.schema";

const propertiesSchema = z.object({
  title: z
    .string()
    .min(1, { message: "El título debe tener al menos 1 caracter" })
    .max(50, { message: "El título debe tener como máximo 50 caracteres" }),
  subtitle: z
    .string()
    .max(100, { message: "El subtítulo debe tener como máximo 100 caracteres" })
    .nullable(),
  deleteImage: z.boolean(),
});

export const createVersionWithPropertiesInputSchema = z.object({
  menuId: z.string(),
  properties: propertiesSchema.extend({
    image: menuImageSchemaWithData,
  }),
});

export const createVersionWithPropertiesFormSchema = z.object({
  title: propertiesSchema.shape.title,
  subtitle: propertiesSchema.shape.subtitle,
  image: menuImageSchema,
  deleteImage: propertiesSchema.shape.deleteImage,
});

export const createVersionWithPropertiesOutputSchema = z.object({
  menuId: z.string(),
  properties: z.object({
    isPublic: z.boolean(),
    title: z.string(),
    subtitle: z.string().nullable(),
    image: z.string().min(1).nullable(),
  }),
});

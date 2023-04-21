import { z } from "zod";

import {
  menuImageSchema,
  menuImageSchemaWithData,
} from "../shared/shared.schema";

const propertiesSchema = z.object({
  title: z.string(),
  subtitle: z.string().nullable(),
  deleteImage: z.boolean(),
});

export const createVersionWithPropertiesInputSchema = z.object({
  menuId: z.string(),
  properties: propertiesSchema.extend({
    image: menuImageSchemaWithData,
  }),
});

export const createVersionWithPropertiesFormSchema = z.object({
  properties: propertiesSchema.extend({
    image: menuImageSchema,
  }),
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

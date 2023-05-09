import { z } from "zod";

export const getMenuPropertiesInputSchema = z.object({
  menuId: z.string().min(1, { message: "El id del menú es requerido" }),
});

export const getMenuPropertiesOutputSchema = z.object({
  properties: z.object({
    isPublic: z.boolean(),
    title: z.string(),
    subtitle: z.string().nullable(),
    image: z.string().min(1).nullable(),
  }),
});

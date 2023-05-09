import { z } from "zod";

export const createVersionWithSectionsInputSchema = z.object({
  menuId: z.string(),
  sections: z.array(
    z.object({
      name: z
        .string()
        .min(1, { message: "El nombre de la sección es requerido" })
        .max(50, {
          message: "El nombre de la sección no puede ser mayor a 50 caracteres",
        }),
      id: z.number().nullable(),
    }),
  ),
});

export const createVersionWithSectionsOutputSchema = z.object({
  isPublic: z.boolean(),
  sections: z.array(
    z.object({
      name: z.string(),
      id: z.number(),
    }),
  ),
});

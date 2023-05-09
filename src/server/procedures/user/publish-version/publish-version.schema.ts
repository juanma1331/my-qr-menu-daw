import { z } from "zod";

export const publishVersionInputSchema = z.object({
  menuId: z.string().min(1, { message: "El id del menú es requerido" }),
});

export const publishVersionOutputSchema = z.discriminatedUnion(
  "publishStatus",
  [
    z.object({
      publishStatus: z.literal("no-sections"),
      success: z.boolean(),
    }),
    z.object({
      publishStatus: z.literal("empty-section"),
      success: z.boolean(),
    }),
    z.object({
      publishStatus: z.literal("success"),
      success: z.boolean(),
    }),
  ],
);

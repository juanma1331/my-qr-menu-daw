import { z } from "zod";

export const createMenuAndVersionSchema = z.object({
  title: z
    .string()
    .min(1, { message: "El menú necesita un título" })
    .max(120, { message: "Máximo 120 caracteres" }),
});

export const createMenuAndVersionOutputSchema = z.discriminatedUnion(
  "creationStatus",
  [
    z.object({
      creationStatus: z.literal("not-allowed"),
    }),
    z.object({
      creationStatus: z.literal("allowed"),
      menuId: z.string().min(1),
    }),
  ],
);

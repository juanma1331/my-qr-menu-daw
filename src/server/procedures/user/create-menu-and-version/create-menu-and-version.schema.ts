import { z } from "zod";

export const createMenuAndVersionSchema = z.object({
  title: z
    .string()
    .min(1, { message: "El título debe tener al menos 1 caracter" })
    .max(120, { message: "El título debe tener como máximo 120 caracteres" }),
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

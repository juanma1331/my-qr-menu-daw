import { z } from "zod";

const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  imageId: z.string(),
});

const sectionSchema = z.object({
  id: z.number(),
  name: z.string(),
  products: z.array(productSchema),
});

const versionSchema = z.object({
  id: z.number(),
  title: z.string(),
  subtitle: z.string().nullable(),
  bgImageId: z.string().nullable(),
  sections: z.array(sectionSchema),
});

export const getVersionForPreviewInputSchema = z.object({
  menuId: z.string().min(1, { message: "El id del menú es requerido" }),
});

export const getVersionForPreviewOutputSchema = z.object({
  version: versionSchema,
});

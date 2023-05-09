import { z } from "zod";

export const getProductInputSchema = z.object({
  id: z.number(),
});

export const getProductOutputSchema = z.object({
  sectionId: z.number(),
  product: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    price: z.number(),
    imageId: z.string(),
  }),
});

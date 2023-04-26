import { z } from "zod";

export const getProductsWithSectionsInputSchema = z.object({
  menuId: z.string(),
});

const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  imageId: z.string().min(1),
  section: z.object({
    id: z.number(),
    name: z.string().min(1),
  }),
});

export const getProductsWithSectionsOutputSchema = z.object({
  isPublic: z.boolean(),
  products: z.array(productSchema),
});

import { z } from "zod";

export const getProductsWithSectionsInputSchema = z.object({
  menuId: z.string().min(1, { message: "El id del menú es requerido" }),
});

const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  imageId: z.string(),
  section: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

export const getProductsWithSectionsOutputSchema = z.object({
  isPublic: z.boolean(),
  products: z.array(productSchema),
});

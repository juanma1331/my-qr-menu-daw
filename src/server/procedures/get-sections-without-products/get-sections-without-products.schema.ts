import { z } from "zod";

export const getSectionsWithoutProductsInputSchema = z.object({
  menuId: z.string(),
});

export const getSectionsWithoutProductsOutputSchema = z.object({
  isPublic: z.boolean(),
  sections: z.array(
    z.object({
      name: z.string().min(1),
      id: z.number(),
    }),
  ),
});

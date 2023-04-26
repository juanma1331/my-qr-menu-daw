import { z } from "zod";

export const createVersionWithoutDeletedProductInputSchema = z.object({
  menuId: z.string(),
  productId: z.number(),
});

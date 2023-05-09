import { z } from "zod";

export const createVersionWithoutDeletedProductInputSchema = z.object({
  menuId: z.string(),
  productId: z
    .number()
    .positive({ message: "El id del producto debe ser positivo" }),
});

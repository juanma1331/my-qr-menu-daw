import { z } from "zod";

export const deleteMenuInputSchema = z.object({
  menuId: z.string(),
});

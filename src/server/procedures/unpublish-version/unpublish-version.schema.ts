import { z } from "zod";

export const unpublishMenuVersionInputSchema = z.object({
  menuId: z.string(),
});

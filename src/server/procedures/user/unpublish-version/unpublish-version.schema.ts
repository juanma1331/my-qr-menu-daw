import { z } from "zod";

export const unpublishMenuVersionInputSchema = z.object({
  menuId: z.string().min(1, { message: "El id del menú es requerido" }),
});

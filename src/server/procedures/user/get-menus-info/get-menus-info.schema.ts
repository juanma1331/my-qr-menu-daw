import { z } from "zod";

const menuInfoSchema = z.object({
  menuId: z.string(),
  title: z.string(),
  isPublic: z.boolean(),
  sections: z.number(),
  products: z.number(),
  menuImage: z.string().min(1).nullable(),
  qrImage: z.string().min(1),
});

export const getMenusInfoOutputSchema = z.object({
  menus: z.array(menuInfoSchema),
});

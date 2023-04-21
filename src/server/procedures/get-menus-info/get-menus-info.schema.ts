import { z } from "zod";

const menuInfoSchema = z.object({
  menuId: z.string(),
  title: z.string(),
  isPublic: z.boolean(),
  sections: z.number(),
  products: z.number(),
});

export const getMenusInfoOutputSchema = z.object({
  menus: z.array(menuInfoSchema),
});

export type GetMenusInfoOutput = z.infer<typeof getMenusInfoOutputSchema>;

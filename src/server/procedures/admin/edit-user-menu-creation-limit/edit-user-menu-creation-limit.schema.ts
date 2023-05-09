import { z } from "zod";

const menuCreationLimitSchema = z.number().min(0);

export const editUserMenuCreationLimitInputSchema = z.object({
  userId: z.string().min(1),
  menuCreationLimit: menuCreationLimitSchema,
});

export const editUserMenuCreationLimitFormSchema = z.object({
  limit: menuCreationLimitSchema,
});

export const editUserMenuCreationLimitOutputSchema = z.object({
  updatedUser: z.object({
    id: z.string().min(1),
    email: z.string().email().nullable(),
    menuCreationLimit: z.number(),
    createdMenus: z.number(),
  }),
});

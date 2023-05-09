import { z } from "zod";

const userInfo = z.object({
  id: z.string().min(1),
  email: z.string().email().nullable(),
  menuCreationLimit: z.number(),
  createdMenus: z.number(),
});

export const getUsersInfoOutputSchema = z.object({
  users: z.array(userInfo),
});

import { adminProcedure } from "~/server/api/trpc";
import { updateUserMenuCreationLimitOnDB } from "./edit-user-menu-creation-limit.behaviour";
import {
  editUserMenuCreationLimitInputSchema,
  editUserMenuCreationLimitOutputSchema,
} from "./edit-user-menu-creation-limit.schema";

export const editUserMenuCreationLimitProcedure = adminProcedure
  .input(editUserMenuCreationLimitInputSchema)
  .output(editUserMenuCreationLimitOutputSchema)
  .mutation(async ({ ctx, input }) => {
    const updatedUser = await updateUserMenuCreationLimitOnDB({
      prisma: ctx.prisma,
      userId: input.userId,
      newLimit: input.menuCreationLimit,
    });

    return {
      updatedUser,
    };
  });

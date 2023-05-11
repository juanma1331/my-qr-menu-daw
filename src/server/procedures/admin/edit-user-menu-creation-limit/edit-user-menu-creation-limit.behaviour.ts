import * as trpc from "@trpc/server";

import type { TrpcContext } from "~/server/api/trpc";
import type { UpdatedUser } from "./edit-user-menu-creation-limit.types";

export type UpdateUserMenuCreationLimitOnDB = {
  prisma: TrpcContext["prisma"];
  userId: string;
  newLimit: number;
};

/**
 * Updates the menu creation limit of a user in the database.
 *
 * @async
 * @function
 * @param {Object} params - The parameters object.
 * @param {Object} params.prisma - The prisma client.
 * @param {number} params.userId - The id of the user whose menu creation limit is to be updated.
 * @param {number} params.newLimit - The new menu creation limit of the user.
 * @throws {trpc.TRPCError} When there is an error updating the user menu creation limit.
 * @returns {Promise<UpdatedUser>} The updated user object.
 */
export const updateUserMenuCreationLimitOnDB = async ({
  prisma,
  userId,
  newLimit,
}: UpdateUserMenuCreationLimitOnDB): Promise<UpdatedUser> => {
  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        menuCreationLimit: newLimit,
      },
      select: {
        id: true,
        email: true,
        menuCreationLimit: true,
        _count: {
          select: {
            menus: true,
          },
        },
      },
    });

    return {
      id: user.id,
      email: user.email,
      menuCreationLimit: user.menuCreationLimit,
      createdMenus: user._count.menus,
    };
  } catch (e) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error updating user menu creation limit",
    });
  }
};

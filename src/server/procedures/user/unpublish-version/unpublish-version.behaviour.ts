import * as trpc from "@trpc/server";

import type { TrpcContext } from "~/server/api/trpc";

export type UpdateMenuVersionIsPublicOnDbParams = {
  prisma: TrpcContext["prisma"];
  menuId: string;
};

/**
 * Updates the isPublic field to false for all menu versions belonging to the specified menu ID in the database.
 *
 * @param {Object} params - The parameters for the function.
 * @param {number} params.menuId - The ID of the menu to update.
 * @param {Object} params.prisma - The Prisma client used to interact with the database.
 * @throws {TRPCError} If updating the isPublic field fails.
 */
export const updateMenuVersionIsPublicOnDb = async ({
  menuId,
  prisma,
}: UpdateMenuVersionIsPublicOnDbParams) => {
  try {
    await prisma.menuVersion.updateMany({
      where: {
        menuId: menuId,
        isPublic: true,
      },
      data: {
        isPublic: false,
      },
    });
  } catch (e) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update menu version isPublic on db",
    });
  }
};

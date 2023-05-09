import * as trpc from "@trpc/server";

import type { TrpcContext } from "~/server/api/trpc";

export type UpdateMenuVersionIsPublicOnDbParams = {
  prisma: TrpcContext["prisma"];
  menuId: string;
};

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

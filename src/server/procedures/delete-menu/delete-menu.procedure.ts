import * as trpc from "@trpc/server";

import { protectedProcedure } from "~/server/api/trpc";
import { getImageIdsFromMenuVersion } from "../shared/shared.behaviour";
import { deleteMenuInputSchema } from "./delete-menu.schema";

export const deleteMenuProcedure = protectedProcedure
  .input(deleteMenuInputSchema)
  .mutation(async ({ ctx, input }) => {
    const menu = await ctx.prisma.menu.findUnique({
      where: { id: input.menuId },
      select: {
        qrId: true,
        versions: {
          select: {
            bgImageId: true,
            sections: {
              select: {
                products: {
                  select: {
                    imageId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!menu) {
      throw new trpc.TRPCError({
        code: "NOT_FOUND",
        message: "Menu not found",
      });
    }

    const deleteImageIds = [menu.qrId];

    for (const version of menu.versions) {
      const versionIds = getImageIdsFromMenuVersion(version);
      deleteImageIds.push(...versionIds);
    }

    try {
      await Promise.all(
        deleteImageIds.map((id) => ctx.storage.deleteImage(id)),
      );

      await ctx.prisma.menu.delete({
        where: { id: input.menuId },
      });
    } catch (e) {
      throw new trpc.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete menu",
      });
    }
  });

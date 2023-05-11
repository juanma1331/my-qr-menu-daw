import * as trpc from "@trpc/server";

import type { TrpcContext } from "~/server/api/trpc";
import type { MenuVersionQuery } from "./get-sections-without-products.types";

export type FindLatesVersionParams = {
  menuId: string;
  prisma: TrpcContext["prisma"];
};

/**
 * Finds the latest version of a menu based on its ID using Prisma.
 *
 * @async
 * @function findLatesVersion
 * @param {object} params - The parameters object.
 * @param {number} params.menuId - The ID of the menu to find the latest version of.
 * @param {object} params.prisma - The Prisma client instance.
 * @throws {TRPCError} If the menu version is not found.
 * @returns {Promise<MenuVersionQuery>} The menu version object.
 */
export const findLatesVersion = async ({
  menuId,
  prisma,
}: FindLatesVersionParams): Promise<MenuVersionQuery> => {
  const menuVersion = await prisma.menuVersion.findFirst({
    where: {
      menuId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      isPublic: true,
      sections: {
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!menuVersion) {
    throw new trpc.TRPCError({
      code: "NOT_FOUND",
      message: "Menu version not found",
    });
  }

  return menuVersion;
};

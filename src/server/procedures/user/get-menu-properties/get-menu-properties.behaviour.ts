import * as trpc from "@trpc/server";

import type { TrpcContext } from "~/server/api/trpc";
import type { VersionQuery } from "./get-menu-properties.types";

export type FindLatestVersionParams = {
  prisma: TrpcContext["prisma"];
  menuId: string;
};

/**
 * Finds the latest version of a menu in the database.
 *
 * @async
 * @function findLatestVersion
 * @param {Object} params - The parameters for finding the latest version
 * @param {Object} params.prisma - The Prisma client instance
 * @param {number} params.menuId - The ID of the menu to look for
 * @return {Promise<Object>} - The latest menu version found
 * @throws {TRPCError} - If a menu version is not found
 */
export const findLatestVersion = async ({
  prisma,
  menuId,
}: FindLatestVersionParams): Promise<VersionQuery> => {
  const latestVersion = await prisma.menuVersion.findFirst({
    where: {
      menuId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      title: true,
      subtitle: true,
      isPublic: true,
      bgImageId: true,
    },
  });

  if (!latestVersion) {
    throw new trpc.TRPCError({
      code: "NOT_FOUND",
      message: "Menu version not found",
    });
  }

  return latestVersion;
};

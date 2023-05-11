import type { PrismaClient } from "@prisma/client";
import * as trpc from "@trpc/server";

import type { MenuInfo, MenuQuery } from "./get-menus-info.types";

export type FindAllMenusFromUserParams = {
  prisma: PrismaClient;
  userId: string;
};

/**
 * Finds all menus belonging to a user.
 *
 * @async
 * @function findAllMenusFromUser
 *
 * @param {Object} params - The function parameters.
 * @param {Object} params.prisma - The Prisma client instance.
 * @param {string} params.userId - The ID of the user whose menus to find.
 *
 * @returns {Promise<Array<Object>>} An array of menu objects.
 */
export const findAllMenusFromUser = async (
  params: FindAllMenusFromUserParams,
): Promise<MenuQuery[]> => {
  const { prisma, userId } = params;

  const sectionsInclude = { _count: { select: { products: true } } };

  const versionSelect = {
    title: true,
    isPublic: true,
    menuId: true,
    bgImageId: true,
    sections: {
      include: sectionsInclude,
    },
  };

  const menus = (await prisma.menu.findMany({
    where: { ownerId: userId },
    select: {
      qrId: true,
      versions: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: versionSelect,
      },
    },
  })) as MenuQuery[];

  return menus;
};

/**
 * Given an array of MenuQuery objects, this function returns an array of MenuInfo objects
 * containing information about the latest version of each menu. If a menu has no versions, an
 * INTERNAL_SERVER_ERROR is thrown.
 *
 * @param {MenuQuery[]} menus - Array of MenuQuery objects to get information from.
 * @return {MenuInfo[]} Array of MenuInfo objects.
 */
export const getMenusInfo = (menus: MenuQuery[]): MenuInfo[] => {
  const latestVersions = menus.map((m) => {
    const version = m.versions[0];

    if (!version) {
      throw new trpc.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Menu has no versions",
      });
    }

    return {
      menuId: version.menuId,
      title: version.title,
      isPublic: version.isPublic,
      sections: version.sections.length,
      products: version.sections.reduce(
        (prev, curr) => prev + curr._count.products,
        0,
      ),
      menuImage: version.bgImageId,
      qrImage: m.qrId,
    };
  });

  return latestVersions;
};

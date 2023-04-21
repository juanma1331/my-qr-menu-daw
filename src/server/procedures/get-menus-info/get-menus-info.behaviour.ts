import type { PrismaClient } from "@prisma/client";
import * as trpc from "@trpc/server";

import type { MenuQuery, MenuVersionQuery } from "./get-menus-info.types";

export type FindAllMenusFromUserParams = {
  prisma: PrismaClient;
  userId: string;
};

export const findAllMenusFromUser = async (
  params: FindAllMenusFromUserParams,
): Promise<MenuQuery[]> => {
  const { prisma, userId } = params;

  const sectionsInclude = { _count: { select: { products: true } } };

  const versionSelect = {
    title: true,
    isPublic: true,
    menuId: true,
    sections: {
      include: sectionsInclude,
    },
  };

  const menus = (await prisma.menu.findMany({
    where: { ownerId: userId },
    select: {
      versions: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: versionSelect,
      },
    },
  })) as MenuQuery[];

  return menus;
};

export const getLatestVersions = (menus: MenuQuery[]): MenuVersionQuery[] => {
  const latestVersions = menus.map((m) => {
    const version = m.versions[0];

    if (!version) {
      throw new trpc.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Menu has no versions",
      });
    }

    return version;
  });

  return latestVersions;
};

import type { PrismaClient } from "@prisma/client";
import * as trpc from "@trpc/server";

import type {
  MenuInfo,
  MenuQuery,
  MenuVersionQuery,
} from "./get-menus-info.types";

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

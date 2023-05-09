import * as trpc from "@trpc/server";

import type { TrpcContext } from "~/server/api/trpc";
import type { MenuVersionQuery } from "./get-sections-without-products.types";

export type FindLatesVersionParams = {
  menuId: string;
  prisma: TrpcContext["prisma"];
};

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

import * as trpc from "@trpc/server";

import type { TrpcContext } from "~/server/api/trpc";
import type { VersionQuery } from "./get-menu-properties.types";

export type FindLatestVersionParams = {
  prisma: TrpcContext["prisma"];
  menuId: string;
};

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

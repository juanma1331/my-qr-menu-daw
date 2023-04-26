import * as trpc from "@trpc/server";

import type { TrpcContext } from "~/server/api/trpc";
import type { IMenuVersion, IProduct } from "~/server/procedures/intertaces";

type MenuVersionQuery = Pick<IMenuVersion, "id" | "bgImageId" | "isPublic"> & {
  sections: SectionQuery[];
};

type SectionQuery = {
  products: ProductQuery[];
};

type ProductQuery = Pick<IProduct, "imageId">;

export type DeleteOldVersionIfNotPublicParams = {
  prisma: TrpcContext["prisma"];
  lastVersion: MenuVersionQuery;
};

export const deleteOldVersionIfNotPublic = async (
  params: DeleteOldVersionIfNotPublicParams,
): Promise<void> => {
  const { prisma, lastVersion } = params;

  if (lastVersion.isPublic) return;

  try {
    await prisma.menuVersion.delete({
      where: { id: lastVersion.id },
    });
  } catch (e) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error deleting old version from db",
    });
  }
};

import * as trpc from "@trpc/server";

import type { TrpcContext } from "~/server/api/trpc";
import type { IMenuVersion, IProduct } from "~/server/procedures/intertaces";

export type MenuVersionQuery = Pick<
  IMenuVersion,
  "id" | "bgImageId" | "isPublic"
> & {
  sections: SectionQuery[];
};

export type SectionQuery = {
  products: ProductQuery[];
};

export type ProductQuery = Pick<IProduct, "imageId">;

export type DeleteOldVersionIfNotPublicParams = {
  prisma: TrpcContext["prisma"];
  lastVersion: MenuVersionQuery;
};

/**
 * Deletes the last version of a menu if it's not public
 *
 * @param {DeleteOldVersionIfNotPublicParams} params - An object containing the parameters
 * @param {PrismaClient} params.prisma - The Prisma client used to interact with the database
 * @param {MenuVersion} params.lastVersion - The last version of the menu
 * @throws {TRPCError} If there's an error deleting from the database
 * @returns {Promise<void>} - A Promise that resolves when the version is deleted
 */
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

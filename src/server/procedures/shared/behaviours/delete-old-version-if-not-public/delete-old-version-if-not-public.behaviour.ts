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
  storage: TrpcContext["storage"];
  lastVersion: MenuVersionQuery;
  publicVersionImageIds: string[];
};

export const deleteOldVersionIfNotPublic = async (
  params: DeleteOldVersionIfNotPublicParams,
): Promise<void> => {
  const { prisma, storage, lastVersion, publicVersionImageIds } = params;

  if (lastVersion.isPublic) return;

  const imageIdsToDelete = [];
  for (const { products } of lastVersion.sections) {
    for (const { imageId } of products) {
      if (imageId) {
        imageIdsToDelete.push(imageId);
      }
    }
  }

  if (lastVersion.bgImageId) imageIdsToDelete.push(lastVersion.bgImageId);

  try {
    await Promise.all(
      imageIdsToDelete.map((id) => {
        if (!publicVersionImageIds.includes(id)) {
          return storage.deleteImage(id);
        }
      }),
    );

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

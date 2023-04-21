import * as trpc from "@trpc/server";

import type { TrpcContext } from "~/server/api/trpc";
import type { IMenuVersion } from "../intertaces";

export type MenuVersion = Pick<IMenuVersion, "bgImageId"> & {
  sections: {
    products: { imageId: string }[];
  }[];
};

export type DeleteOldVersionIfNotPublicParams = {
  prisma: TrpcContext["prisma"];
  storage: TrpcContext["storage"];
  lastVersion: {
    id: number;
    bgImageId: string | null;
    isPublic: boolean;
    sections: {
      products: {
        imageId: string;
      }[];
    }[];
  };
  publicVersionImageIds: string[];
};

export const getImageIdsFromMenuVersion = (
  version: MenuVersion | undefined,
) => {
  if (!version) return [];

  const imagesIDs = new Set<string>();

  for (const section of version.sections) {
    for (const product of section.products) {
      imagesIDs.add(product.imageId);
    }
  }

  if (version.bgImageId) {
    imagesIDs.add(version.bgImageId);
  }

  return Array.from(imagesIDs);
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
      message: "Error deleting old version",
    });
  }
};

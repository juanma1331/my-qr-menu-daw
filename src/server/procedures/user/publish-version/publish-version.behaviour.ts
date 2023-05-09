import * as trpc from "@trpc/server";

import type { TrpcContext } from "~/server/api/trpc";
import { getImageIdsFromMenuVersion } from "../shared/behaviours/get-image-ids-from-menu-version/get-image-ids-from-menu-version.behaviour";
import type { MenuVersionQuery } from "./publish-version.types";

export type GetLastMenuVersionAndPublicMenuVersionParams = {
  prisma: TrpcContext["prisma"];
  menuId: string;
};

export type PublishMenuVersionOnDbParams = {
  prisma: TrpcContext["prisma"];
  lastVersionId: number;
};

export type DeleteOldPublicMenuVersionFromDbIfNecessaryParams = {
  prisma: TrpcContext["prisma"];
  publicVersionId: number | undefined;
};

export type DeletePublicMenuVersionImagesFromStorageIfNecessaryParams = {
  storage: TrpcContext["storage"];
  lastVersion: MenuVersionQuery;
  publicVersion: MenuVersionQuery | undefined;
};

export const getLastMenuVersionAndPublicMenuVersion = async ({
  prisma,
  menuId,
}: GetLastMenuVersionAndPublicMenuVersionParams): Promise<{
  lastVersion: MenuVersionQuery;
  publicVersion: MenuVersionQuery | undefined;
}> => {
  const menu = await prisma.menu.findUnique({
    where: {
      id: menuId,
    },
    select: {
      versions: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          isPublic: true,
          bgImageId: true,
          sections: {
            select: {
              products: {
                select: {
                  imageId: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!menu) {
    throw new trpc.TRPCError({
      code: "NOT_FOUND",
      message: "Menu not found",
    });
  }

  const lastVersion = menu.versions[0];

  if (!lastVersion) {
    throw new trpc.TRPCError({
      code: "NOT_FOUND",
      message: "Menu version not found",
    });
  }

  const publicVersion = menu.versions.find((version) => version.isPublic);

  return {
    lastVersion,
    publicVersion,
  };
};

export const hasNoSections = (version: MenuVersionQuery): boolean => {
  return version.sections.length === 0;
};

export const hasAnyEmptySections = (version: MenuVersionQuery): boolean => {
  return version.sections.some((section) => {
    return section.products.length === 0;
  });
};

export const publishMenuVersionOnDb = async ({
  prisma,
  lastVersionId,
}: PublishMenuVersionOnDbParams): Promise<void> => {
  try {
    await prisma.menuVersion.update({
      where: {
        id: lastVersionId,
      },
      data: {
        isPublic: true,
      },
    });
  } catch (e) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error while publishing menu version on db",
    });
  }
};

export const deleteOldPublicMenuVersionFromDbIfNeccessary = async ({
  prisma,
  publicVersionId,
}: DeleteOldPublicMenuVersionFromDbIfNecessaryParams): Promise<void> => {
  if (!publicVersionId) return;

  try {
    await prisma.menuVersion.delete({
      where: {
        id: publicVersionId,
      },
    });
  } catch (e) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error while deleting old public menu version from db",
    });
  }
};

export const deletePublicMenuVersionImagesFromStorageIfNecessary = async ({
  storage,
  lastVersion,
  publicVersion,
}: DeletePublicMenuVersionImagesFromStorageIfNecessaryParams): Promise<void> => {
  if (!publicVersion) {
    return;
  }

  const lastVersionImageIds = getImageIdsFromMenuVersion(lastVersion);
  const publicVersionImageIds = getImageIdsFromMenuVersion(publicVersion);

  const imageIdsToDelete = publicVersionImageIds.filter((imageId) => {
    return !lastVersionImageIds.includes(imageId);
  });

  try {
    await Promise.all(
      imageIdsToDelete.map((imageId) => {
        return storage.deleteImage(imageId);
      }),
    );
  } catch (e) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error while deleting public menu version images from storage",
    });
  }
};

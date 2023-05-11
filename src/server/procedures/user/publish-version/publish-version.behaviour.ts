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

/**
 * Returns the last version and public version of a menu with the given ID.
 *
 * @async
 * @function
 * @param {object} params - The function parameters.
 * @param {PrismaClient} params.prisma - The Prisma client instance.
 * @param {string} params.menuId - The ID of the menu to retrieve versions for.
 * @throws {TRPCError} NOT_FOUND - If menu or menu version not found.
 * @returns {Promise<{
 *   lastVersion: MenuVersionQuery;
 *   publicVersion: MenuVersionQuery | undefined;
 * }>} The last version and public version of the menu.
 */
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

/**
 * Checks if the provided MenuVersionQuery object has no sections.
 *
 * @param {MenuVersionQuery} version - The MenuVersionQuery object to check.
 * @return {boolean} Returns true if the provided object has no sections, false otherwise.
 */
export const hasNoSections = (version: MenuVersionQuery): boolean => {
  return version.sections.length === 0;
};

/**
 * Checks if any section in the menu version has empty products.
 *
 * @param {MenuVersionQuery} version - The menu version to check.
 * @return {boolean} Returns true if any section in the menu version has empty products, otherwise false.
 */
export const hasAnyEmptySections = (version: MenuVersionQuery): boolean => {
  return version.sections.some((section) => {
    return section.products.length === 0;
  });
};

/**
 * Updates a menu version to be public in the database.
 *
 * @param {object} params - The parameters object.
 * @param {PrismaClient} params.prisma - The Prisma client.
 * @param {string} params.lastVersionId - The ID of the last version of the menu.
 * @returns {Promise<void>} - A Promise that resolves when the menu version has been updated.
 * @throws {TRPCError} - Throws an error if there was an issue updating the menu version.
 */
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

/**
 * Deletes old public menu version from the database if necessary.
 *
 * @param {Object} params - The function parameters.
 * @param {Object} params.prisma - The Prisma client.
 * @param {string} params.publicVersionId - The ID of the public version to delete.
 * @throws {trpc.TRPCError} If there's an error while deleting the old public menu version.
 * @returns {Promise<void>}
 */
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

/**
 * Deletes images from storage if they belong to the public version of the menu and if they were not included in
 * the previous version of the menu.
 *
 * @param {Object} params - An object containing the necessary parameters.
 * @param {Storage} params.storage - An instance of the storage class.
 * @param {MenuVersion} params.lastVersion - The last version of the menu.
 * @param {MenuVersion} params.publicVersion - The public version of the menu.
 * @throws {TRPCError} Throws an error if there is an issue deleting images from storage.
 * @return {Promise<void>} A promise that resolves when all images have been deleted.
 */
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

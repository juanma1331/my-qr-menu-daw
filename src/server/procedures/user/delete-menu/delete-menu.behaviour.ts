import * as trpc from "@trpc/server";

import type { TrpcContext } from "~/server/api/trpc";
import { getImageIdsFromMenuVersion } from "../shared/behaviours/get-image-ids-from-menu-version/get-image-ids-from-menu-version.behaviour";
import type { MenuQuery } from "./delete-menu.types";

export type FindMenuParams = {
  menuId: string;
  prisma: TrpcContext["prisma"];
};

export type DeleteMenuImagesFromStorageParams = {
  menu: MenuQuery;
  storage: TrpcContext["storage"];
};

export type DeleteMenuFromDBParams = {
  menuId: string;
  prisma: TrpcContext["prisma"];
};

/**
 * Finds a menu in the database based on the given menu ID.
 *
 * @async
 * @function
 * @param {object} FindMenuParams - The parameters for finding the menu.
 * @param {string} FindMenuParams.menuId - The ID of the menu to find.
 * @param {object} FindMenuParams.prisma - The Prisma client used to access the database.
 * @throws {TRPCError} If the menu is not found.
 * @returns {Promise<MenuQuery>} The menu with the given ID.
 */
export const findMenu = async ({
  menuId,
  prisma,
}: FindMenuParams): Promise<MenuQuery> => {
  const menu = await prisma.menu.findUnique({
    where: { id: menuId },
    select: {
      qrId: true,
      versions: {
        select: {
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

  return menu;
};

/**
 * Deletes menu images from storage.
 *
 * @param {Object} params - The parameters object.
 * @param {Menu} params.menu - The menu object containing the images to delete.
 * @param {Object} params.storage - The storage object to delete the images from.
 * @return {Promise<void>} - Resolves when all images have been deleted.
 * @throws {TRPCError} - Throws an INTERNAL_SERVER_ERROR if the deletion fails.
 */
export const deleteMenuImagesFromStorage = async ({
  menu,
  storage,
}: DeleteMenuImagesFromStorageParams): Promise<void> => {
  const deleteImageIds = [menu.qrId];

  try {
    for (const version of menu.versions) {
      const versionIds = getImageIdsFromMenuVersion(version);
      deleteImageIds.push(...versionIds);
    }

    await Promise.all(deleteImageIds.map((id) => storage.deleteImage(id)));
  } catch (e) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete menu images from storage",
    });
  }
};

/**
 * Deletes a menu from the database.
 *
 * @param {Object} params - The function parameters.
 * @param {string} params.menuId - The ID of the menu to delete.
 * @param {Object} params.prisma - The Prisma client.
 * @throws {trpc.TRPCError} When the deletion fails.
 * @returns {Promise<void>} A Promise that resolves when the menu is deleted.
 */
export const deleteMenuFromDB = async ({
  menuId,
  prisma,
}: DeleteMenuFromDBParams): Promise<void> => {
  try {
    await prisma.menu.delete({
      where: { id: menuId },
    });
  } catch (e) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete menu from db",
    });
  }
};

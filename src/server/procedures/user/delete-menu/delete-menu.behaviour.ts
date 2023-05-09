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

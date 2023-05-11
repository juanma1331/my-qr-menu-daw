import * as trpc from "@trpc/server";

import type { RouterInputs } from "~/utils/api";
import type { TrpcContext } from "~/server/api/trpc";
import type {
  CreatedMenuVersion,
  MenuVersionQuery,
} from "./create-version-with-new-properties.types";

export type CreateNewVersionDataParams = {
  lastVersion: MenuVersionQuery;
  input: RouterInputs["menus"]["createVersionWithNewProperties"];
  storage: TrpcContext["storage"];
};

export type CreateNewVersionParams = {
  data: Awaited<ReturnType<typeof createNewVersionData>>;
  prisma: TrpcContext["prisma"];
};

export type DeleteOldVersionBgImageFromStorageIfNeeded = {
  storage: TrpcContext["storage"];
  input: RouterInputs["menus"]["createVersionWithNewProperties"];
  imageId: string | null;
  isLastVersionPublic: boolean;
};

/**
 * Creates new version data based on last version data and input from user
 *
 * @param {CreateNewVersionDataParams} params - An object containing last version data, user input, and storage
 * @param {Object} params.lastVersion - An object containing the last version data
 * @param {Object} params.input - An object containing user input data
 * @param {Object} params.storage - An object representing storage
 * @return {Object} An object containing new version data
 * @throws {TRPCError} Throws TRPCError if there's an error uploading image
 */
export const createNewVersionData = async ({
  lastVersion,
  input,
  storage,
}: CreateNewVersionDataParams) => {
  const sections = lastVersion.sections.map((section) => ({
    name: section.name,
    position: section.position,
    products: {
      create: section.products.map((product) => ({
        name: product.name,
        description: product.description,
        price: product.price,
        imageId: product.imageId,
      })),
    },
  }));

  const newVersionData = {
    menuId: input.menuId,
    title: input.properties.title,
    subtitle: input.properties.subtitle,
    sections: { create: sections },
  };

  if (input.properties.deleteImage) {
    return { ...newVersionData, bgImageId: null };
  } else if (input.properties.image) {
    try {
      const id = await storage.upload(input.properties.image.data);
      return { ...newVersionData, bgImageId: id };
    } catch (e) {
      throw new trpc.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error uploading image",
      });
    }
  } else {
    return {
      ...newVersionData,
      bgImageId: lastVersion.bgImageId,
    };
  }
};

/**
 * Creates a new menu version with the provided params.
 *
 * @async
 * @function createNewVersion
 * @param {CreateNewVersionParams} params - The params needed to create a new menu version.
 * @returns {Promise<CreatedMenuVersion>} The newly created menu version.
 * @throws {trpc.TRPCError} Throws an error if there is an issue creating the new version.
 */
export const createNewVersion = async (
  params: CreateNewVersionParams,
): Promise<CreatedMenuVersion> => {
  const { data, prisma } = params;
  try {
    return await prisma.menuVersion.create({
      data,
      select: {
        isPublic: true,
        title: true,
        subtitle: true,
        bgImageId: true,
      },
    });
  } catch (e) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error creating new version",
    });
  }
};

/**
 * Deletes old version of background image from storage if needed.
 *
 * @async
 * @function
 * @param {Object} input - The input object.
 * @param {Object} input.storage - The storage object.
 * @param {Object} input.input - The input object.
 * @param {string} input.imageId - The image ID.
 * @param {boolean} input.isLastVersionPublic - Indicates if the last version is public.
 * @throws {TRPCError} - If there's an error deleting the image.
 */
export const deleteOldVersionBgImageFromStorageIfNeeded = async ({
  storage,
  input,
  imageId,
  isLastVersionPublic,
}: DeleteOldVersionBgImageFromStorageIfNeeded) => {
  if (isLastVersionPublic) return;

  const shouldDelete =
    input.properties.deleteImage || input.properties.image !== null;

  if (shouldDelete && imageId) {
    try {
      await storage.deleteImage(imageId);
    } catch (e) {
      throw new trpc.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error deleting image",
      });
    }
  }
};

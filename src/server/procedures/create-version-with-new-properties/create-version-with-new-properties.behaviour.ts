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

export const createNewVersionData = async (
  params: CreateNewVersionDataParams,
) => {
  const { lastVersion, input, storage } = params;
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

export const deleteOldVersionBgImageFromStorageIfNeeded = async (
  params: DeleteOldVersionBgImageFromStorageIfNeeded,
) => {
  const { storage, input, imageId, isLastVersionPublic } = params;

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

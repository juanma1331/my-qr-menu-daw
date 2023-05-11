import * as trpc from "@trpc/server";

import type { TrpcContext } from "~/server/api/trpc";
import type { SectionQuery } from "../shared/behaviours/get-latest-version/get-latest-version.behaviour";
import type {
  NewVersionData,
  PreparedSection,
} from "./create-version-without-deleted-product.types";

export type RemoveProductFromSectionParams = {
  sections: SectionQuery[];
  productId: number;
};

export type PrepareVersionSectionsForCreationParams = {
  sections: SectionQuery[];
};

export type CreateNewVersionParams = {
  prisma: TrpcContext["prisma"];
  menuId: string;
  sections: PreparedSection[];
  newVersionData: NewVersionData;
};

export type DeleteProductImageFromStorageParams = {
  storage: TrpcContext["storage"];
  sections: SectionQuery[];
  productId: number;
  isLastVersionPublic: boolean;
};

/**
 * Removes a product with the given productId from the array of SectionQuery objects.
 * Throws a TRPCError if the product section is not found.
 *
 * @param {Object} params - An object containing an array of SectionQuery objects and the productId to remove.
 * @param {SectionQuery[]} params.sections - The array of SectionQuery objects to remove the product from.
 * @param {string} params.productId - The productId of the product to remove.
 * @return {SectionQuery[]} An array of SectionQuery objects with the product removed.
 */
export const removeProductFromSection = ({
  sections,
  productId,
}: RemoveProductFromSectionParams): SectionQuery[] => {
  const productSectionId = sections.find((section) =>
    section.products.some((product) => product.id === productId),
  )?.id;

  if (!productSectionId) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Product section not found",
    });
  }

  return sections.map((section) => {
    if (section.id === productSectionId) {
      return {
        ...section,
        products: section.products.filter(
          (product) => product.id !== productId,
        ),
      };
    }

    return section;
  });
};

/**
 * Returns an array of PreparedSection objects based on the provided array of sections.
 *
 * @param {PrepareVersionSectionsForCreationParams} params - An object containing the sections array to be processed.
 * @param {Section[]} params.sections - An array of Section objects to be processed.
 * @return {PreparedSection[]} - An array of PreparedSection objects.
 */
export const prepareVersionSectionsForCreation = ({
  sections,
}: PrepareVersionSectionsForCreationParams): PreparedSection[] => {
  return sections.map((section) => ({
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
};

/**
 * Creates a new version of a menu with the given menu id, sections, and new version data.
 *
 * @param {Object} CreateNewVersionParams - An object containing parameters for creating a new version
 * @param {Object} CreateNewVersionParams.prisma - The Prisma client used to make database queries
 * @param {string} CreateNewVersionParams.menuId - The id of the menu for which a new version is being created
 * @param {Object[]} CreateNewVersionParams.sections - An array of section objects for the new version
 * @param {Object} CreateNewVersionParams.newVersionData - An object containing additional data for the new version
 * @throws {TRPCError} Throws an error if there is an issue with creating the new version
 * @return {Promise<void>} Returns a promise that resolves with no value upon successful completion
 */
export const createNewVersion = async ({
  prisma,
  menuId,
  sections,
  newVersionData,
}: CreateNewVersionParams): Promise<void> => {
  try {
    await prisma.menuVersion.create({
      data: {
        ...newVersionData,
        menuId,
        sections: {
          create: sections,
        },
      },
    });
  } catch (e) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error while creating new version",
    });
  }
};

/**
 * Deletes a product image from storage.
 *
 * @param {Object} params - Parameters object.
 * @param {Array<Object>} params.sections - List of product sections.
 * @param {Object} params.storage - Storage object.
 * @param {string} params.productId - The ID of the product to delete.
 * @param {boolean} params.isLastVersionPublic - Whether or not this is the last public version of the product.
 * @throws {trpc.TRPCError} If the product section or image are not found.
 * @throws {trpc.TRPCError} If there is an error deleting the product image.
 * @return {Promise<void>} Resolves when the image is deleted.
 */
export const deleteProductImageFromStorage = async ({
  sections,
  storage,
  productId,
  isLastVersionPublic,
}: DeleteProductImageFromStorageParams): Promise<void> => {
  if (isLastVersionPublic) return;

  const productSectionId = sections.find((section) =>
    section.products.some((product) => product.id === productId),
  )?.id;

  if (!productSectionId) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Product section not found",
    });
  }

  const imageId = sections
    .find((section) => section.id === productSectionId)
    ?.products.find((product) => product.id === productId)?.imageId;

  if (!imageId) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Product image not found",
    });
  }

  try {
    await storage.deleteImage(imageId);
  } catch (e) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error while deleting product image",
    });
  }
};

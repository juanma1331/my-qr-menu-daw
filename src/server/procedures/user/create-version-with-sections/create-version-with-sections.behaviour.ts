import * as trpc from "@trpc/server";

import type { RouterInputs } from "~/utils/api";
import type { TrpcContext } from "~/server/api/trpc";
import { getImageIdsFromMenuVersion } from "../shared/behaviours/get-image-ids-from-menu-version/get-image-ids-from-menu-version.behaviour";
import type {
  MenuVersionQuery,
  ProductQuery,
  SectionQuery,
} from "../shared/behaviours/get-latest-version/get-latest-version.behaviour";
import type {
  CreatedMenuVersion,
  MenuVersionForCreation,
} from "./create-version-with-sections.types";

export type PrepareSectionsParams = {
  sections: RouterInputs["menus"]["createVersionWithSections"]["sections"];
  products: ProductQuery[];
};

export type PrepareProductsParams = {
  product: ProductQuery;
};

export type CreateNewVersionParams = {
  prisma: TrpcContext["prisma"];
  menuId: string;
  version: MenuVersionForCreation;
  sections: ReturnType<typeof prepareSectionsForCreation>;
};

export type DeleteProductImagesFromStorageIfNeededParams = {
  storage: TrpcContext["storage"];
  lastVersion: MenuVersionQuery;
  createdVersion: CreatedMenuVersion;
};

/**
 * Returns an array of all products from an array of section queries.
 *
 * @param {SectionQuery[]} sections - An array of section queries.
 * @return {ProductQuery[]} An array of product queries.
 */
export const getProductsFromVersionSections = (
  sections: SectionQuery[],
): ProductQuery[] => {
  return sections.flatMap((s) => s.products);
};

/**
 * Returns a new object with the necessary properties from the provided ProductQuery
 *
 * @param {ProductQuery} product - An object containing the product data
 * @return {Object} - A new object with the properties name, description, price, and imageId
 */
export const prepareProductForCreation = (product: ProductQuery) => ({
  name: product.name,
  description: product.description,
  price: product.price,
  imageId: product.imageId,
});

/**
 * Returns an object with sections prepared for creation with their respective
 * products. Each section is mapped to an object containing its name, position,
 * and an array of products that belong to it, as specified in the products
 * parameter.
 *
 * @param {Object} param - An object containing two properties: sections and
 * products. Sections is an array of objects representing a section to be
 * created, and products is an array of objects representing the products
 * associated with those sections.
 * @param {Array} param.sections - An array of objects representing a section
 * to be created.
 * @param {Array} param.products - An array of objects representing the
 * products associated with the sections.
 * @return {Object} An object with a create property that contains an array of
 * objects, each representing a section to be created with its respective
 * products.
 */
export const prepareSectionsForCreation = ({
  sections,
  products,
}: PrepareSectionsParams) => {
  return {
    create: sections.map((s, i) => ({
      name: s.name,
      position: i + 1,
      products: {
        create: products
          .filter((p) => p.sectionId === s.id)
          .map((p) => prepareProductForCreation(p)),
      },
    })),
  };
};

/**
 * Creates a new menu version with the given parameters.
 *
 * @param {CreateNewVersionParams} params - The parameters for creating the new version.
 * @param {string} params.menuId - The ID of the menu to create the new version for.
 * @param {MenuVersion} params.version - The version data to create the new version with.
 * @param {MenuSection[]} params.sections - The sections for the new version.
 * @param {PrismaClient} params.prisma - The Prisma client instance to use for database operations.
 * @returns {Promise<CreatedMenuVersion>} The created menu version.
 * @throws {trpc.TRPCError} If there is an error creating the new version.
 */
export const createNewVersion = async (
  params: CreateNewVersionParams,
): Promise<CreatedMenuVersion> => {
  const { prisma, menuId, version, sections } = params;

  try {
    const createdVersion = await prisma.menuVersion.create({
      data: {
        menuId,
        sections,
        title: version.title,
        subtitle: version.subtitle,
        bgImageId: version.bgImageId,
      },
      select: {
        isPublic: true,
        bgImageId: true,
        sections: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            name: true,
            products: {
              select: {
                imageId: true,
              },
            },
          },
        },
      },
    });

    return createdVersion;
  } catch (e) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error creating new version",
    });
  }
};

/**
 * Deletes images from storage that are no longer associated with a product
 *
 * @param {Object} DeleteProductImagesFromStorageIfNeeded - Object containing storage, lastVersion,
 * and createdVersion for images.
 * @param {Object} DeleteProductImagesFromStorageIfNeeded.storage - Storage object for deleting images
 * @param {Object} DeleteProductImagesFromStorageIfNeeded.lastVersion - The last version of images
 * @param {Object} DeleteProductImagesFromStorageIfNeeded.createdVersion - The current version of images
 * @return {Promise<void>} - A promise that resolves when all images are deleted
 * @throws {TRPCError} - Throws an error if there is an issue deleting images from storage
 */
export const deleteProductImagesFromStorageIfNeeded = async ({
  storage,
  lastVersion,
  createdVersion,
}: DeleteProductImagesFromStorageIfNeededParams): Promise<void> => {
  const lastVersionProductImageIds = getImageIdsFromMenuVersion(lastVersion);
  const createdVersionProductImageIds =
    getImageIdsFromMenuVersion(createdVersion);

  const imageIdsToDelete = lastVersionProductImageIds.filter(
    (id) => !createdVersionProductImageIds.includes(id),
  );

  try {
    await Promise.all(imageIdsToDelete.map((id) => storage.deleteImage(id)));
  } catch (e) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error deleting product images from storage",
    });
  }
};

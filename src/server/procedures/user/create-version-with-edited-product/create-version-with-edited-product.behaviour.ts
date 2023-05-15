import * as trpc from "@trpc/server";

import type { RouterInputs } from "~/utils/api";
import type { TrpcContext } from "~/server/api/trpc";
import type { SectionQuery } from "../shared/behaviours/get-latest-version/get-latest-version.behaviour";
import type {
  NewVersionData,
  PreparedSection,
  ProductToBeUpdated,
} from "./create-version-with-edited-product.types";

export type HandleProductImageParams = {
  storage: TrpcContext["storage"];
  currentImageId: string;
  newImage: RouterInputs["menus"]["createVersionWithEditedProduct"]["product"]["image"];
};

export type SeparateSectionsParams = {
  productSectionId: number;
  sections: SectionQuery[];
};

export type PrepareProductForCreationParams = {
  newProduct: RouterInputs["menus"]["createVersionWithEditedProduct"]["product"];
  imageId: string;
};

export type ReplaceProductInSectionParams = {
  sections: SectionQuery[];
  newProduct: ProductToBeUpdated;
  productSectionId: number;
};

export type CreateNewVersionParams = {
  prisma: TrpcContext["prisma"];
  menuId: string;
  sections: PreparedSection[];
  newVersionData: NewVersionData;
};

/**
 * Handles the product image, either uploading a new one or keeping the current one.
 *
 * @param {Object} HandleProductImageParams - An object containing the storage, currentImageId, and newImage.
 * @param {Object} HandleProductImageParams.storage - The storage object to handle the image.
 * @param {string} HandleProductImageParams.currentImageId - The current image ID.
 * @param {Object|null} HandleProductImageParams.newImage - The new image to upload, or null if no new image.
 * @return {Promise<string>} The new image ID if a new image was uploaded, or the current image ID if not.
 * @throws {trpc.TRPCError} If there was an error processing the image.
 */
export const handleProductImage = async ({
  storage,
  currentImageId,
  newImage,
}: HandleProductImageParams): Promise<string> => {
  const userHasEditedTheImage = newImage !== null;

  try {
    if (userHasEditedTheImage) {
      await storage.deleteImage(currentImageId);
      return await storage.upload(newImage.data);
    } else {
      return currentImageId;
    }
  } catch (error) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error procesando la imagen",
    });
  }
};

/**
 * Prepares a new product for creation by extracting relevant information from the given
 * parameters and returning it in a product update format.
 *
 * @param {object} PrepareProductForCreationParams - An object containing newProduct and
 * imageId.
 * @param {Product} PrepareProductForCreationParams.newProduct - The new product object.
 * @param {string} PrepareProductForCreationParams.imageId - The id of the product image.
 * @returns {ProductToBeUpdated} - The product update object containing id, imageId, name,
 * description and price of the new product.
 */
export const prepareProductForCreation = ({
  newProduct,
  imageId,
}: PrepareProductForCreationParams): ProductToBeUpdated => {
  return {
    id: newProduct.id,
    imageId,
    name: newProduct.name,
    description: newProduct.description,
    price: newProduct.price,
  };
};

/**
 * Replaces a product in each section of an array of sections with a new product.
 *
 * @param {Object} ReplaceProductInSectionParams - An object containing the sections array and the newProduct object.
 * @param {Object[]} ReplaceProductInSectionParams.sections - An array of section objects.
 * @param {Object} ReplaceProductInSectionParams.newProduct - The new product object.
 * @param {string} ReplaceProductInSectionParams.newProduct.id - The ID of the new product.
 * @param {string} ReplaceProductInSectionParams.newProduct.name - The name of the new product.
 * @param {string} ReplaceProductInSectionParams.newProduct.description - The description of the new product.
 * @param {number} ReplaceProductInSectionParams.newProduct.price - The price of the new product.
 * @param {string} ReplaceProductInSectionParams.newProduct.imageId - The image ID of the new product.
 * @return {Object[]} An array of section objects with the new product replacing the old product.
 */
export const replaceProductInSection = ({
  sections,
  newProduct,
  productSectionId,
}: ReplaceProductInSectionParams): PreparedSection[] => {
  const originProductSectionId = sections
    .flatMap((section) => section.products)
    .find((p) => p.id === newProduct.id)?.sectionId;

  if (!originProductSectionId) {
    throw new trpc.TRPCError({
      code: "BAD_REQUEST",
      message: "Origin section not  found",
    });
  }

  const hasSectionChanged = originProductSectionId !== productSectionId;

  let sectionsToBePrepared: SectionQuery[] = sections;

  if (hasSectionChanged) {
    const originalProduct = sections
      .flatMap((section) => section.products)
      .find((p) => p.id === newProduct.id);

    if (!originalProduct) {
      throw new trpc.TRPCError({
        code: "BAD_REQUEST",
        message: "Original product not found",
      });
    }

    sectionsToBePrepared = sections.map((section) => {
      if (section.id === originProductSectionId) {
        return {
          ...section,
          products: section.products.filter((p) => p.id !== newProduct.id),
        };
      }

      if (section.id === productSectionId) {
        return {
          ...section,
          products: [...section.products, originalProduct],
        };
      }

      return section;
    });
  }

  return sectionsToBePrepared.map((section) => ({
    name: section.name,
    position: section.position,
    products: {
      create: section.products.map((product) => {
        if (product.id === newProduct.id) {
          return {
            name: newProduct.name,
            description: newProduct.description,
            price: newProduct.price,
            imageId: newProduct.imageId,
          };
        }

        return {
          name: product.name,
          description: product.description,
          price: product.price,
          imageId: product.imageId,
        };
      }),
    },
  }));
};

/**
 * Creates a new version of a menu with the given sections and new version data.
 *
 * @async
 * @function
 * @param {object} params - The parameters object.
 * @param {object} params.prisma - The Prisma client.
 * @param {string} params.menuId - The ID of the menu to create a new version of.
 * @param {object[]} params.sections - An array of section objects for the new version.
 * @param {object} params.newVersionData - The data for the new menu version.
 * @throws {trpc.TRPCError} Throws an error if there is an issue creating the new version.
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

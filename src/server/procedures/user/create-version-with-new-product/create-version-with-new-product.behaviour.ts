import * as trpc from "@trpc/server";

import type { RouterInputs } from "~/utils/api";
import type { TrpcContext } from "~/server/api/trpc";
import type { SectionQuery } from "../shared/behaviours/get-latest-version/get-latest-version.behaviour";
import type {
  NewVersionData,
  PreparedProduct,
  PreparedSection,
} from "./create-version-with-new-product.types";

export type PrepareProductForCreationParams = {
  newProduct: RouterInputs["menus"]["createVersionWithNewProduct"]["product"];
  storage: TrpcContext["storage"];
};

export type PrepareVersionSectionsForCreationParams = {
  sections: SectionQuery[];
  productSectionId: number;
};

export type AddNewProductToSectionParams = {
  sections: PreparedSection[];
  newProduct: PreparedProduct;
  productSectionPosition: number;
};

export type CreateNewVersionParams = {
  prisma: TrpcContext["prisma"];
  menuId: string;
  sections: PreparedSection[];
  newVersionData: NewVersionData;
};

/**
 * Prepares a new product for creation by uploading its image to storage and extracting its relevant fields.
 *
 * @param {object} params - Object containing newProduct and storage.
 * @param {object} params.newProduct - Object containing the new product's name, description, price, and image data.
 * @param {object} params.storage - Instance of a storage service.
 * @returns {Promise<object>} - Object containing the new product's imageId, name, description, and price.
 * @throws {TRPCError} - Throws an error if there's an issue preparing the product for creation.
 */
export const prepareProductForCreation = async ({
  newProduct,
  storage,
}: PrepareProductForCreationParams): Promise<PreparedProduct> => {
  try {
    const imageId = await storage.upload(newProduct.image.data);

    return {
      imageId,
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
    };
  } catch (e) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error while preparing product for creation",
    });
  }
};

/**
 * Prepares a list of sections for version creation by mapping through the `sections` array
 * and creating a new array of objects with a specific shape. Throws an error if the section
 * with the provided `productSectionId` doesn't exist.
 *
 * @param {object} params - An object containing `sections` and `productSectionId`.
 * @param {array} params.sections - An array of objects containing `name`, `position`, and `products`.
 * @param {string} params.productSectionId - The ID of the product section.
 * @return {object} An object containing `preparedSections` and `productSectionPosition`.
 * @throws {TRPCError} If section with provided id does not exist.
 */
export const prepareVersionSectionsForCreation = ({
  sections,
  productSectionId,
}: PrepareVersionSectionsForCreationParams): {
  preparedSections: PreparedSection[];
  productSectionPosition: number;
} => {
  const preparedSections = sections.map((section) => ({
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

  const productSection = sections.find(
    (section) => section.id === productSectionId,
  );

  if (!productSection) {
    throw new trpc.TRPCError({
      code: "BAD_REQUEST",
      message: "Section with provided id does not exist",
    });
  }

  return { preparedSections, productSectionPosition: productSection.position };
};

/**
 * Adds a new product to the given product section position of the provided
 * sections. Returns a new array of prepared sections.
 *
 * @param {object} params - An object containing:
 *   @param {array} sections - The array of sections to add the product to.
 *   @param {object} newProduct - The new product to add.
 *   @param {number} productSectionPosition - The section position to add the
 *     new product to.
 * @return {array} An array of prepared sections with the new product added to
 *   the specified section.
 */
export const addNewProductToSection = ({
  sections,
  newProduct,
  productSectionPosition,
}: AddNewProductToSectionParams): PreparedSection[] => {
  return sections.map((section) => ({
    ...section,
    products: {
      create:
        section.position === productSectionPosition
          ? [...section.products.create, newProduct]
          : [...section.products.create],
    },
  }));
};

/**
 * Creates a new version of a menu with the given sections and data.
 *
 * @async
 * @function createNewVersion
 * @param {object} params - The parameters object.
 * @param {PrismaClient} params.prisma - The Prisma client.
 * @param {number} params.menuId - The ID of the menu to create a new version for.
 * @param {object[]} params.sections - An array of objects representing the sections of the menu.
 * @param {object} params.newVersionData - The data for the new version of the menu.
 * @throws {TRPCError} Throws an error if there was an issue creating the new version.
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

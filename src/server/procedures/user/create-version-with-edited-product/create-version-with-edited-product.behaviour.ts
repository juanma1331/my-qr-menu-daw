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
};

export type CreateNewVersionParams = {
  prisma: TrpcContext["prisma"];
  menuId: string;
  sections: PreparedSection[];
  newVersionData: NewVersionData;
};

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

export const replaceProductInSection = ({
  sections,
  newProduct,
}: ReplaceProductInSectionParams): PreparedSection[] => {
  return sections.map((section) => ({
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
    console.log(e);
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error while creating new version",
    });
  }
};

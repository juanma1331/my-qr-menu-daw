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

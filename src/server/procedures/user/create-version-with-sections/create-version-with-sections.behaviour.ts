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

export type CreateNewVersion = {
  prisma: TrpcContext["prisma"];
  menuId: string;
  version: MenuVersionForCreation;
  sections: ReturnType<typeof prepareSectionsForCreation>;
};

export type DeleteProductImagesFromStorageIfNeeded = {
  storage: TrpcContext["storage"];
  lastVersion: MenuVersionQuery;
  createdVersion: CreatedMenuVersion;
};

export const getProductsFromVersionSections = (
  sections: SectionQuery[],
): ProductQuery[] => {
  return sections.flatMap((s) => s.products);
};

export const prepareProductForCreation = (product: ProductQuery) => ({
  name: product.name,
  description: product.description,
  price: product.price,
  imageId: product.imageId,
});

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

export const createNewVersion = async (
  params: CreateNewVersion,
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

export const deleteProductImagesFromStorageIfNeeded = async ({
  storage,
  lastVersion,
  createdVersion,
}: DeleteProductImagesFromStorageIfNeeded): Promise<void> => {
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

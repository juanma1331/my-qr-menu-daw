import * as trpc from "@trpc/server";

import type { RouterInputs } from "~/utils/api";
import type { TrpcContext } from "~/server/api/trpc";
import type {
  ProductQuery,
  SectionQuery,
} from "../shared/behaviours/get-latest-version-and-public-version/get-latest-version-and-public-version.behaviour";
import type {
  MenuVersionForCreation,
  SectionFromCreatedVersion,
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

export const prepareSectionsForCreation = (params: PrepareSectionsParams) => {
  const { sections, products } = params;

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
): Promise<{
  sections: SectionFromCreatedVersion[];
  isPublic: boolean;
}> => {
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
        sections: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      sections: createdVersion.sections,
      isPublic: createdVersion.isPublic,
    };
  } catch (e) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error creating new version",
    });
  }
};

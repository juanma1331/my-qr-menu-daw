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

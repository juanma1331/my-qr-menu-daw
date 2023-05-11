import * as trpc from "@trpc/server";

import type { TrpcContext } from "~/server/api/trpc";
import type {
  MenuVersionQuery,
  ProductQuery,
  SectionQuery,
} from "./get-products-with-sections.types";

export type FindLastVersionParams = {
  prisma: TrpcContext["prisma"];
  menuId: string;
};

export type GetProductsFromVersionSectionsParams = {
  sections: SectionQuery[];
};

/**
 * Finds the last version of a menu based on the given parameters.
 *
 * @async
 * @function findLastVersion
 * @param {object} FindLastVersionParams - An object containing:
 * @param {PrismaClient} FindLastVersionParams.prisma - The Prisma client.
 * @param {number} FindLastVersionParams.menuId - The ID of the menu to search for.
 * @throws {TRPCError} If no version is found.
 * @returns {Promise<MenuVersionQuery>} The last version of the menu.
 */
export const findLastVersion = async ({
  prisma,
  menuId,
}: FindLastVersionParams): Promise<MenuVersionQuery> => {
  const version = await prisma.menuVersion.findFirst({
    where: {
      menuId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      isPublic: true,
      sections: {
        select: {
          products: {
            select: {
              id: true,
              name: true,
              price: true,
              imageId: true,
              section: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!version) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No version found",
    });
  }

  return version;
};

/**
 * Returns an array of ProductQuery based on the products in each section of the
 * provided sections object.
 *
 * @param {Object} params - The input parameters object.
 * @param {Array} params.sections - An array of section objects containing products.
 * @return {Array} An array of ProductQuery objects.
 */
export const getProductsFromVersionSections = ({
  sections,
}: GetProductsFromVersionSectionsParams): ProductQuery[] => {
  return sections.flatMap((section) => section.products);
};

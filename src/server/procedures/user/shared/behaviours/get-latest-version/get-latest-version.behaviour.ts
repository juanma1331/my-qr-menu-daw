import * as trpc from "@trpc/server";

import type { TrpcContext } from "~/server/api/trpc";
import type {
  IMenuVersion,
  IProduct,
  ISection,
} from "~/server/procedures/interfaces";

export type MenuVersionQuery = Omit<IMenuVersion, "menu" | "sections"> & {
  sections: SectionQuery[];
};

export type SectionQuery = Pick<
  ISection,
  "id" | "name" | "position" | "menuVersionId"
> & {
  products: ProductQuery[];
};

export type ProductQuery = Pick<
  IProduct,
  "id" | "name" | "description" | "price" | "imageId" | "sectionId"
>;

export type GetLastVersionParams = {
  prisma: TrpcContext["prisma"];
  menuId: string;
};

/**
 * Returns the latest version of a menu based on the menu ID.
 *
 * @async
 * @function getLastMenuVersion
 * @param {GetLastVersionParams} params - The parameters object containing Prisma client and menu ID.
 * @throws {TRPCError} - Throws a TRPCError with code "NOT_FOUND" if no versions are found for the menu.
 * @returns {Promise<MenuVersionQuery>} - Returns a Promise that resolves to the latest version of the menu.
 */
export const getLastMenuVersion = async (
  params: GetLastVersionParams,
): Promise<MenuVersionQuery> => {
  const { prisma, menuId } = params;
  const versions = await prisma.menuVersion.findMany({
    where: { menuId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      subtitle: true,
      bgImageId: true,
      isPublic: true,
      createdAt: true,
      menuId: true,
      sections: {
        select: {
          id: true,
          name: true,
          position: true,
          menuVersionId: true,
          products: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              imageId: true,
              sectionId: true,
            },
          },
        },
      },
    },
  });

  const lastVersion = versions[0];

  if (!lastVersion) {
    throw new trpc.TRPCError({
      code: "NOT_FOUND",
      message: "No versions found for this menu",
    });
  }

  return lastVersion;
};

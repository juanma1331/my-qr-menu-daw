import type { TrpcContext } from "~/server/api/trpc";
import type { MenuVersionQuery } from "./get-public-version.types";

export type GetLastPublicMenuVersionParams = {
  prisma: TrpcContext["prisma"];
  menuId: string;
};

/**
 * Gets the last public version of a menu.
 *
 * @async
 * @function getLastPublicMenuVersion
 * @param {object} params - The parameters object.
 * @param {object} params.prisma - The Prisma client instance.
 * @param {number} params.menuId - The ID of the menu.
 * @returns {Promise<MenuVersionQuery | null>} The last public version of the menu, or null if it does not exist.
 */
export const getLastPublicMenuVersion = async ({
  prisma,
  menuId,
}: GetLastPublicMenuVersionParams): Promise<MenuVersionQuery | null> => {
  const version = await prisma.menuVersion.findFirst({
    where: {
      menuId,
      isPublic: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      title: true,
      subtitle: true,
      bgImageId: true,
      sections: {
        select: {
          name: true,
          products: {
            select: {
              name: true,
              description: true,
              price: true,
              imageId: true,
            },
          },
        },
      },
    },
  });

  return version;
};

import * as trpc from "@trpc/server";

import type { TrpcContext } from "~/server/api/trpc";
import type {
  IMenuVersion,
  IProduct,
  ISection,
} from "~/server/procedures/intertaces";

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

export const getLastVersionAndPublicVersion = async (
  params: GetLastVersionParams,
): Promise<{
  lastVersion: MenuVersionQuery;
  publicVersion: MenuVersionQuery | undefined;
}> => {
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

  if (versions.length === 0) {
    throw new trpc.TRPCError({
      code: "NOT_FOUND",
      message: "No versions found for this menu",
    });
  }

  const publicVersion = versions.find((version) => version.isPublic);
  const lastVersion = versions[0];

  if (!lastVersion) {
    throw new trpc.TRPCError({
      code: "NOT_FOUND",
      message: "No versions found for this menu",
    });
  }

  return {
    lastVersion,
    publicVersion,
  };
};

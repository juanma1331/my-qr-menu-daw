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
              description: true,
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

export const getProductsFromVersionSections = ({
  sections,
}: GetProductsFromVersionSectionsParams): ProductQuery[] => {
  return sections.flatMap((section) => section.products);
};

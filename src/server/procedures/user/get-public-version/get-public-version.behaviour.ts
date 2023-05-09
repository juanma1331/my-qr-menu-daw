import type { TrpcContext } from "~/server/api/trpc";
import type { MenuVersionQuery } from "./get-public-version.types";

export type GetLastPublicMenuVersionParams = {
  prisma: TrpcContext["prisma"];
  menuId: string;
};

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

import * as trpc from "@trpc/server";

import type { TrpcContext } from "~/server/api/trpc";
import type { ProductQuery } from "./get-product.types";

export type FindProductParams = {
  id: number;
  prisma: TrpcContext["prisma"];
};

export const findProduct = async ({
  id,
  prisma,
}: FindProductParams): Promise<ProductQuery> => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      imageId: true,
      sectionId: true,
    },
  });

  if (!product) {
    throw new trpc.TRPCError({
      code: "NOT_FOUND",
      message: "Product not found",
    });
  }

  return product;
};

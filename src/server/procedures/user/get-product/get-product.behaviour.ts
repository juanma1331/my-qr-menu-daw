import * as trpc from "@trpc/server";

import type { TrpcContext } from "~/server/api/trpc";
import type { ProductQuery } from "./get-product.types";

export type FindProductParams = {
  id: number;
  prisma: TrpcContext["prisma"];
};

/**
 * Finds a product in the database by ID using the provided prisma client.
 *
 * @async
 * @function
 * @param {Object} params - The parameters object.
 * @param {number} params.id - The ID of the product to find.
 * @param {PrismaClient} params.prisma - The Prisma client instance to use for database queries.
 * @throws {TRPCError} If no product is found with the specified ID.
 * @returns {Promise<ProductQuery>} The product matching the ID.
 */
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

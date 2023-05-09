import { protectedProcedure } from "~/server/api/trpc";
import { findProduct } from "./get-product.behaviour";
import {
  getProductInputSchema,
  getProductOutputSchema,
} from "./get-product.schema";

export const getProductProcedure = protectedProcedure
  .input(getProductInputSchema)
  .output(getProductOutputSchema)
  .query(async ({ ctx, input }) => {
    const product = await findProduct({
      id: input.id,
      prisma: ctx.prisma,
    });

    return {
      sectionId: product.sectionId,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageId: product.imageId,
      },
    };
  });

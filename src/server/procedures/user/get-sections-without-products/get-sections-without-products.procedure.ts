import { protectedProcedure } from "~/server/api/trpc";
import { findLatesVersion } from "./get-sections-without-products.behaviour";
import {
  getSectionsWithoutProductsInputSchema,
  getSectionsWithoutProductsOutputSchema,
} from "./get-sections-without-products.schema";

export const getSectionsWithoutProductsProcedure = protectedProcedure
  .input(getSectionsWithoutProductsInputSchema)
  .output(getSectionsWithoutProductsOutputSchema)
  .query(async ({ ctx, input }) => {
    const latestVersion = await findLatesVersion({
      prisma: ctx.prisma,
      menuId: input.menuId,
    });

    return {
      isPublic: latestVersion.isPublic,
      sections: latestVersion.sections,
    };
  });

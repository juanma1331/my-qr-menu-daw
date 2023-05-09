import { protectedProcedure } from "~/server/api/trpc";
import {
  findLastVersion,
  getProductsFromVersionSections,
} from "./get-products-with-sections.behaviour";
import {
  getProductsWithSectionsInputSchema,
  getProductsWithSectionsOutputSchema,
} from "./get-products-with-sections.schema";

export const getProductsWithSectionsProcedure = protectedProcedure
  .input(getProductsWithSectionsInputSchema)
  .output(getProductsWithSectionsOutputSchema)
  .query(async ({ ctx, input }) => {
    const version = await findLastVersion({
      prisma: ctx.prisma,
      menuId: input.menuId,
    });

    const products = getProductsFromVersionSections({
      sections: version.sections,
    });

    return {
      isPublic: version.isPublic,
      products,
    };
  });

import type { PrismaClient } from "@prisma/client";

import { protectedProcedure } from "~/server/api/trpc";
import { deleteOldVersionIfNotPublic } from "../shared/behaviours/delete-old-version-if-not-public/delete-old-version-if-not-public.behaviour";
import { getLastMenuVersion } from "../shared/behaviours/get-latest-version/get-latest-version.behaviour";
import {
  addNewProductToSection,
  createNewVersion,
  prepareProductForCreation,
  prepareVersionSectionsForCreation,
} from "./create-version-with-new-product.behaviour";
import { createVersionWithNewProductInputSchema } from "./create-version-with-new-product.schema";

export const createVersionWithNewProductProcedure = protectedProcedure
  .input(createVersionWithNewProductInputSchema)
  .mutation(async ({ ctx, input }) => {
    const lastVersion = await getLastMenuVersion({
      prisma: ctx.prisma,
      menuId: input.menuId,
    });

    const preparedProduct = await prepareProductForCreation({
      newProduct: input.product,
      storage: ctx.storage,
    });

    const { preparedSections, productSectionPosition } =
      prepareVersionSectionsForCreation({
        sections: lastVersion.sections,
        productSectionId: input.sectionId,
      });

    const updatedSections = addNewProductToSection({
      productSectionPosition,
      sections: preparedSections,
      newProduct: preparedProduct,
    });

    await ctx.prisma.$transaction(async (prisma) => {
      await createNewVersion({
        prisma: prisma as PrismaClient,
        menuId: input.menuId,
        newVersionData: {
          title: lastVersion.title,
          subtitle: lastVersion.subtitle,
          bgImageId: lastVersion.bgImageId,
        },
        sections: updatedSections,
      });

      await deleteOldVersionIfNotPublic({
        lastVersion,
        prisma: ctx.prisma,
      });
    });
  });

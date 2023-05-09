import type { PrismaClient } from "@prisma/client";

import { protectedProcedure } from "~/server/api/trpc";
import { deleteOldVersionIfNotPublic } from "../shared/behaviours/delete-old-version-if-not-public/delete-old-version-if-not-public.behaviour";
import { getLastMenuVersion } from "../shared/behaviours/get-latest-version/get-latest-version.behaviour";
import {
  createNewVersion,
  handleProductImage,
  prepareProductForCreation,
  replaceProductInSection,
} from "./create-version-with-edited-product.behaviour";
import { createVersionWithEditedProductInputSchema } from "./create-version-with-edited-product.schema";

export const createVersionWithEditedProductProcedure = protectedProcedure
  .input(createVersionWithEditedProductInputSchema)
  .mutation(async ({ ctx, input }) => {
    const lastVersion = await getLastMenuVersion({
      prisma: ctx.prisma,
      menuId: input.menuId,
    });

    const productImageId = await handleProductImage({
      storage: ctx.storage,
      currentImageId: input.product.currentImageId,
      newImage: input.product.image,
    });

    const preparedProduct = prepareProductForCreation({
      newProduct: input.product,
      imageId: productImageId,
    });

    const updatedSections = replaceProductInSection({
      sections: lastVersion.sections,
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

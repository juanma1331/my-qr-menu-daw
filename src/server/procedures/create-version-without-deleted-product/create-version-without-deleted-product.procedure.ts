import type { PrismaClient } from "@prisma/client";

import { protectedProcedure } from "~/server/api/trpc";
import { deleteOldVersionIfNotPublic } from "../shared/behaviours/delete-old-version-if-not-public/delete-old-version-if-not-public.behaviour";
import { getLastMenuVersion } from "../shared/behaviours/get-latest-version/get-latest-version.behaviour";
import {
  createNewVersion,
  deleteProductImageFromStorage,
  prepareVersionSectionsForCreation,
  removeProductFromSection,
} from "./create-version-without-deleted-product.behaviour";
import { createVersionWithoutDeletedProductInputSchema } from "./create-version-without-deleted-product.schema";

export const createVersionWithoutDeletedProductProcedure = protectedProcedure
  .input(createVersionWithoutDeletedProductInputSchema)
  .mutation(async ({ ctx, input }) => {
    const lastVersion = await getLastMenuVersion({
      menuId: input.menuId,
      prisma: ctx.prisma,
    });

    const sectionsWithoutProduct = removeProductFromSection({
      sections: lastVersion.sections,
      productId: input.productId,
    });

    const preparedSections = prepareVersionSectionsForCreation({
      sections: sectionsWithoutProduct,
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
        sections: preparedSections,
      });

      await deleteOldVersionIfNotPublic({
        lastVersion,
        prisma: ctx.prisma,
      });
    });

    await deleteProductImageFromStorage({
      storage: ctx.storage,
      sections: lastVersion.sections,
      productId: input.productId,
      isLastVersionPublic: lastVersion.isPublic,
    });
  });

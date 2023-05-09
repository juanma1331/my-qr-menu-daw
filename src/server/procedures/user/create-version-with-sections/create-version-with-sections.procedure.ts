import type { PrismaClient } from "@prisma/client";

import { protectedProcedure } from "~/server/api/trpc";
import { deleteOldVersionIfNotPublic } from "../shared/behaviours/delete-old-version-if-not-public/delete-old-version-if-not-public.behaviour";
import { getLastMenuVersion } from "../shared/behaviours/get-latest-version/get-latest-version.behaviour";
import {
  createNewVersion,
  deleteProductImagesFromStorageIfNeeded,
  getProductsFromVersionSections,
  prepareSectionsForCreation,
} from "./create-version-with-sections.behaviour";
import {
  createVersionWithSectionsInputSchema,
  createVersionWithSectionsOutputSchema,
} from "./create-version-with-sections.schema";

export const createVersionWithSectionsProcedure = protectedProcedure
  .input(createVersionWithSectionsInputSchema)
  .output(createVersionWithSectionsOutputSchema)
  .mutation(async ({ ctx, input }) => {
    const lastVersion = await getLastMenuVersion({
      prisma: ctx.prisma,
      menuId: input.menuId,
    });

    const versionProducts = getProductsFromVersionSections(
      lastVersion.sections,
    );

    const preparedSections = prepareSectionsForCreation({
      sections: input.sections,
      products: versionProducts,
    });

    const createdVersion = await ctx.prisma.$transaction(async (prisma) => {
      const version = await createNewVersion({
        prisma: prisma as PrismaClient,
        menuId: input.menuId,
        version: {
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
      return version;
    });

    await deleteProductImagesFromStorageIfNeeded({
      storage: ctx.storage,
      lastVersion,
      createdVersion,
    });

    return {
      isPublic: createdVersion.isPublic,
      sections: createdVersion.sections,
    };
  });

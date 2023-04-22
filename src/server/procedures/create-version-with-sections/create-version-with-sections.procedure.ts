import type { PrismaClient } from "@prisma/client";

import { protectedProcedure } from "~/server/api/trpc";
import { deleteOldVersionIfNotPublic } from "../shared/behaviours/delete-old-version-if-not-public/delete-old-version-if-not-public.behaviour";
import { getImageIdsFromMenuVersion } from "../shared/behaviours/get-image-ids-from-menu-version/get-image-ids-from-menu-version.behaviour";
import { getLastVersionAndPublicVersion } from "../shared/behaviours/get-latest-version-and-public-version/get-latest-version-and-public-version.behaviour";
import {
  createNewVersion,
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
    const { lastVersion, publicVersion } = await getLastVersionAndPublicVersion(
      {
        prisma: ctx.prisma,
        menuId: input.menuId,
      },
    );

    const versionProducts = getProductsFromVersionSections(
      lastVersion.sections,
    );

    const preparedSections = prepareSectionsForCreation({
      sections: input.sections,
      products: versionProducts,
    });

    const publicVersionImageIds = getImageIdsFromMenuVersion(publicVersion);

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
        publicVersionImageIds,
        prisma: ctx.prisma,
        storage: ctx.storage,
      });
      return version;
    });

    return {
      isPublic: createdVersion.isPublic,
      sections: createdVersion.sections,
    };
  });

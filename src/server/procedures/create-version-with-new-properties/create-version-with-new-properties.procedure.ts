import type { PrismaClient } from "@prisma/client";

import { protectedProcedure } from "~/server/api/trpc";
import { deleteOldVersionIfNotPublic } from "../shared/behaviours/delete-old-version-if-not-public/delete-old-version-if-not-public.behaviour";
import { getImageIdsFromMenuVersion } from "../shared/behaviours/get-image-ids-from-menu-version/get-image-ids-from-menu-version.behaviour";
import { getLastVersionAndPublicVersion } from "../shared/behaviours/get-latest-version-and-public-version/get-latest-version-and-public-version.behaviour";
import {
  createNewVersion,
  createNewVersionData,
} from "./create-version-with-new-properties.behaviour";
import {
  createVersionWithPropertiesInputSchema,
  createVersionWithPropertiesOutputSchema,
} from "./create-version-with-new-properties.schema";

export const createVersionWithPropertiesProcedure = protectedProcedure
  .input(createVersionWithPropertiesInputSchema)
  .output(createVersionWithPropertiesOutputSchema)
  .mutation(async ({ ctx, input }) => {
    const { lastVersion, publicVersion } = await getLastVersionAndPublicVersion(
      {
        prisma: ctx.prisma,
        menuId: input.menuId,
      },
    );

    const publicVersionImageIds = getImageIdsFromMenuVersion(publicVersion);

    const newVersionData = await createNewVersionData({
      lastVersion,
      input,
      storage: ctx.storage,
    });

    const newVersion = await ctx.prisma.$transaction(async (prisma) => {
      const createdVersion = await createNewVersion({
        data: newVersionData,
        prisma: prisma as PrismaClient,
      });

      await deleteOldVersionIfNotPublic({
        lastVersion,
        publicVersionImageIds,
        prisma: ctx.prisma,
        storage: ctx.storage,
      });
      return createdVersion;
    });

    return {
      menuId: input.menuId,
      properties: {
        isPublic: newVersion.isPublic,
        title: newVersion.title,
        subtitle: newVersion.subtitle,
        image: newVersion.bgImageId,
      },
    };
  });

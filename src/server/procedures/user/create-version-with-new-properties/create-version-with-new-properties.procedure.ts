import type { PrismaClient } from "@prisma/client";

import { protectedProcedure } from "~/server/api/trpc";
import { deleteOldVersionIfNotPublic } from "../shared/behaviours/delete-old-version-if-not-public/delete-old-version-if-not-public.behaviour";
import { getLastMenuVersion } from "../shared/behaviours/get-latest-version/get-latest-version.behaviour";
import {
  createNewVersion,
  createNewVersionData,
  deleteOldVersionBgImageFromStorageIfNeeded,
} from "./create-version-with-new-properties.behaviour";
import {
  createVersionWithPropertiesInputSchema,
  createVersionWithPropertiesOutputSchema,
} from "./create-version-with-new-properties.schema";

export const createVersionWithPropertiesProcedure = protectedProcedure
  .input(createVersionWithPropertiesInputSchema)
  .output(createVersionWithPropertiesOutputSchema)
  .mutation(async ({ ctx, input }) => {
    const lastVersion = await getLastMenuVersion({
      prisma: ctx.prisma,
      menuId: input.menuId,
    });

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
        prisma: ctx.prisma,
      });

      return createdVersion;
    });

    await deleteOldVersionBgImageFromStorageIfNeeded({
      storage: ctx.storage,
      input,
      imageId: lastVersion.bgImageId,
      isLastVersionPublic: lastVersion.isPublic,
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

import type { PrismaClient } from "@prisma/client";
import * as trpc from "@trpc/server";

import { protectedProcedure } from "~/server/api/trpc";
import {
  deleteOldPublicMenuVersionFromDbIfNeccessary,
  deletePublicMenuVersionImagesFromStorageIfNecessary,
  getLastMenuVersionAndPublicMenuVersion,
  hasAnyEmptySections,
  hasNoSections,
  publishMenuVersionOnDb,
} from "./publish-version.behaviour";
import {
  publishVersionInputSchema,
  publishVersionOutputSchema,
} from "./publish-version.schema";

export const publishVersionProcedure = protectedProcedure
  .input(publishVersionInputSchema)
  .output(publishVersionOutputSchema)
  .mutation(async ({ ctx, input }) => {
    const { lastVersion, publicVersion } =
      await getLastMenuVersionAndPublicMenuVersion({
        prisma: ctx.prisma,
        menuId: input.menuId,
      });

    if (lastVersion.isPublic) {
      throw new trpc.TRPCError({
        code: "BAD_REQUEST",
        message: "Version is already public",
      });
    }

    if (hasNoSections(lastVersion)) {
      return {
        publishStatus: "no-sections",
        success: false,
      };
    }

    if (hasAnyEmptySections(lastVersion)) {
      return {
        publishStatus: "empty-section",
        success: false,
      };
    }

    await ctx.prisma.$transaction(async (prisma) => {
      await publishMenuVersionOnDb({
        prisma: prisma as PrismaClient,
        lastVersionId: lastVersion.id,
      });

      await deleteOldPublicMenuVersionFromDbIfNeccessary({
        prisma: prisma as PrismaClient,
        publicVersionId: publicVersion?.id,
      });
    });

    await deletePublicMenuVersionImagesFromStorageIfNecessary({
      storage: ctx.storage,
      publicVersion: publicVersion,
      lastVersion: lastVersion,
    });

    return {
      publishStatus: "success",
      success: true,
    };
  });

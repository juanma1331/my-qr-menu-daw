import { protectedProcedure } from "~/server/api/trpc";
import { getLastMenuVersion } from "../shared/behaviours/get-latest-version/get-latest-version.behaviour";
import {
  getVersionForPreviewInputSchema,
  getVersionForPreviewOutputSchema,
} from "./get-version-for-preview.schema";

export const getVersionForPrevioProcedure = protectedProcedure
  .input(getVersionForPreviewInputSchema)
  .output(getVersionForPreviewOutputSchema)
  .query(async ({ ctx, input }) => {
    const lastVersion = await getLastMenuVersion({
      menuId: input.menuId,
      prisma: ctx.prisma,
    });

    return {
      version: lastVersion,
    };
  });

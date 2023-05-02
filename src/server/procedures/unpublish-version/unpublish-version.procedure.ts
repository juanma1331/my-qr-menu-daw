import { protectedProcedure } from "~/server/api/trpc";
import { updateMenuVersionIsPublicOnDb } from "./unpublish-version.behaviour";
import { unpublishMenuVersionInputSchema } from "./unpublish-version.schema";

export const unpublishMenuVersionProcedure = protectedProcedure
  .input(unpublishMenuVersionInputSchema)
  .mutation(async ({ ctx, input }) => {
    await updateMenuVersionIsPublicOnDb({
      prisma: ctx.prisma,
      menuId: input.menuId,
    });
  });

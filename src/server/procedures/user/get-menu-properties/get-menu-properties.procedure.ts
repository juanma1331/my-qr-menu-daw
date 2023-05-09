import { protectedProcedure } from "~/server/api/trpc";
import { findLatestVersion } from "./get-menu-properties.behaviour";
import {
  getMenuPropertiesInputSchema,
  getMenuPropertiesOutputSchema,
} from "./get-menu-properties.schema";

export const getMenuPropertiesProcedure = protectedProcedure
  .input(getMenuPropertiesInputSchema)
  .output(getMenuPropertiesOutputSchema)
  .query(async ({ ctx, input }) => {
    const latestVersion = await findLatestVersion({
      prisma: ctx.prisma,
      menuId: input.menuId,
    });

    return {
      properties: {
        title: latestVersion.title,
        subtitle: latestVersion.subtitle,
        isPublic: latestVersion.isPublic,
        image: latestVersion.bgImageId,
      },
    };
  });

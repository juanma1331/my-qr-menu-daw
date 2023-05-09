import { publicProcedure } from "~/server/api/trpc";
import { getLastPublicMenuVersion } from "./get-public-version.behaviour";
import {
  getPublicVersionInputSchema,
  getPublicVersionOutputSchema,
} from "./get-public-version.schema";

export const getPublicVersionProcedure = publicProcedure
  .input(getPublicVersionInputSchema)
  .output(getPublicVersionOutputSchema)
  .query(async ({ ctx, input }) => {
    const publicVersion = await getLastPublicMenuVersion({
      prisma: ctx.prisma,
      menuId: input.menuId,
    });

    return {
      version: publicVersion,
    };
  });

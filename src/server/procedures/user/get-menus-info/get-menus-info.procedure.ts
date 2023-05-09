import { protectedProcedure } from "~/server/api/trpc";
import { findAllMenusFromUser, getMenusInfo } from "./get-menus-info.behaviour";
import { getMenusInfoOutputSchema } from "./get-menus-info.schema";

export const getMenusInfoProcedure = protectedProcedure
  .output(getMenusInfoOutputSchema)
  .query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const menus = await findAllMenusFromUser({
      userId,
      prisma: ctx.prisma,
    });

    const menusInfo = getMenusInfo(menus);

    return {
      menus: menusInfo,
    };
  });

import { protectedProcedure } from "~/server/api/trpc";
import {
  findAllMenusFromUser,
  getLatestVersions,
} from "./get-menus-info.behaviour";
import { getMenusInfoOutputSchema } from "./get-menus-info.schema";

export const getMenusInfoProcedure = protectedProcedure
  .output(getMenusInfoOutputSchema)
  .query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const menus = await findAllMenusFromUser({
      userId,
      prisma: ctx.prisma,
    });

    const latestVersions = getLatestVersions(menus);

    return {
      menus: latestVersions.map((v) => {
        return {
          menuId: v.menuId,
          title: v.title,
          isPublic: v.isPublic,
          sections: v.sections.length,
          products: v.sections.reduce(
            (prev, curr) => prev + curr._count.products,
            0,
          ),
        };
      }),
    };
  });

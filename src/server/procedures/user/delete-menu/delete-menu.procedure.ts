import { protectedProcedure } from "~/server/api/trpc";
import {
  deleteMenuFromDB,
  deleteMenuImagesFromStorage,
  findMenu,
} from "./delete-menu.behaviour";
import { deleteMenuInputSchema } from "./delete-menu.schema";

export const deleteMenuProcedure = protectedProcedure
  .input(deleteMenuInputSchema)
  .mutation(async ({ ctx, input }) => {
    const menu = await findMenu({
      menuId: input.menuId,
      prisma: ctx.prisma,
    });

    await deleteMenuImagesFromStorage({
      menu,
      storage: ctx.storage,
    });

    await deleteMenuFromDB({
      menuId: input.menuId,
      prisma: ctx.prisma,
    });
  });

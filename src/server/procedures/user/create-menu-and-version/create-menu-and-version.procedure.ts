import { randomUUID } from "node:crypto";

import { protectedProcedure } from "~/server/api/trpc";
import {
  createMenuAndVersion,
  findUser,
  generateQrContent,
  handleQrImage,
} from "./create-menu-and-version.behaviour";
import {
  createMenuAndVersionOutputSchema,
  createMenuAndVersionSchema,
} from "./create-menu-and-version.schema";

export const createMenuAndVersionProcedure = protectedProcedure
  .input(createMenuAndVersionSchema)
  .output(createMenuAndVersionOutputSchema)
  .mutation(async ({ input, ctx }) => {
    const userId = ctx.session.user.id;
    const user = await findUser({
      userId,
      prisma: ctx.prisma,
    });

    if (user._count.menus === user.menuCreationLimit) {
      return {
        creationStatus: "not-allowed",
      };
    }

    const menuId = randomUUID();
    const qrContent = generateQrContent(menuId);

    const qrId = await handleQrImage({
      storage: ctx.storage,
      qrGenerator: ctx.qr,
      qrContent,
    });

    await createMenuAndVersion({
      userId,
      menuId,
      qrId,
      prisma: ctx.prisma,
      title: input.title,
    });

    return {
      creationStatus: "allowed",
      menuId,
    };
  });

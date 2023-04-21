import * as trpc from "@trpc/server";

import { env } from "~/env.mjs";
import type { TrpcContext } from "~/server/api/trpc";
import type { UserQuery } from "./create-menu-and-version.types";

export type FindUserParams = {
  prisma: TrpcContext["prisma"];
  userId: string;
};

export type HandleQrImageParams = {
  storage: TrpcContext["storage"];
  qrGenerator: TrpcContext["qr"];
  qrContent: string;
};

export type CreateMenuAndVersionParams = {
  prisma: TrpcContext["prisma"];
  userId: string;
  menuId: string;
  qrId: string;
  title: string;
};

export const findUser = async ({
  prisma,
  userId,
}: FindUserParams): Promise<UserQuery> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      menuCreationLimit: true,
      _count: { select: { menus: true } },
    },
  });

  if (!user) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "User not found",
    });
  }

  return user;
};

export const generateQrContent = (id: string) =>
  `${env.QR_BASE_URL}/public/${id}`;

export const handleQrImage = async (
  params: HandleQrImageParams,
): Promise<string> => {
  const { storage, qrGenerator, qrContent } = params;

  const qrImage = await qrGenerator.generateQr(qrContent);

  if (!qrImage) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong generating the QR code",
    });
  }

  try {
    return await storage.upload(qrImage);
  } catch (error) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong uploading the QR code",
    });
  }
};

export const createMenuAndVersion = async (
  params: CreateMenuAndVersionParams,
) => {
  const { prisma, userId, menuId, qrId, title } = params;

  await prisma.menu.create({
    data: {
      id: menuId,
      qrId,
      ownerId: userId,
      versions: {
        create: {
          title,
        },
      },
    },
  });
};

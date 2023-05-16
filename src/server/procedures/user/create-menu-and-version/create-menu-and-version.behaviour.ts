import * as trpc from "@trpc/server";

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

/**
 * Finds a user in the database using their user ID.
 *
 * @param {Object} params - The parameters object.
 * @param {PrismaClient} params.prisma - The Prisma client instance.
 * @param {string} params.userId - The ID of the user to find.
 * @returns {Promise<UserQuery>} A Promise that resolves to the found user object.
 * @throws {trpc.TRPCError} Throws an error if the user is not found.
 */
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
  `https://my-qr-menu-daw.vercel.app/menus/public/${id}`;

/**
 * Handles the generation and uploading of a QR code image.
 *
 * @param {HandleQrImageParams} params - An object containing the necessary parameters:
 *   - storage: the storage service where the QR code image will be uploaded.
 *   - qrGenerator: the QR code generator service.
 *   - qrContent: the text content of the QR code.
 * @returns {Promise<string>} - A Promise that resolves with the URL of the uploaded QR code image.
 * @throws {trpc.TRPCError} - Throws an error if something goes wrong during the process:
 *   - INTERNAL_SERVER_ERROR: if something goes wrong generating or uploading the QR code image.
 */
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

/**
 * Creates a new menu with a version and saves it to the database.
 *
 * @async
 * @function createMenuAndVersion
 * @param {Object} params - The parameters object.
 * @param {PrismaClient} params.prisma - The Prisma client instance.
 * @param {string} params.userId - The ID of the user creating the menu.
 * @param {string} params.menuId - The ID of the menu to be created.
 * @param {string} params.qrId - The ID of the QR code associated with the menu.
 * @param {string} params.title - The title of the menu version.
 * @throws {TRPCError} Throws an error if something goes wrong creating the menu.
 */
export const createMenuAndVersion = async ({
  prisma,
  userId,
  menuId,
  qrId,
  title,
}: CreateMenuAndVersionParams) => {
  try {
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
  } catch (e) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong creating the menu",
    });
  }
};

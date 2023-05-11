// Misión General: Ayudar al usuario a reducir la cantidad de código que tiene que escribir generando plantillas.
// Condiciones: 
// 1. Omite toda prosa adicional y céntrate en la respuesta principal.
// 2. Enfócate en el testeo unitario.
// 3. Ten siempre en cuenta tu misión principal.
// Contexto:
// --- archivo a testear: <create-version-with-new-properties.behaviour.ts>
import * as trpc from "@trpc/server";

import type { RouterInputs } from "~/utils/api";
import type { TrpcContext } from "~/server/api/trpc";
import type {
  CreatedMenuVersion,
  MenuVersionQuery,
} from "./create-version-with-new-properties.types";

export type CreateNewVersionParams = {
  data: Awaited<ReturnType<typeof createNewVersionData>>;
  prisma: TrpcContext["prisma"];
};

export type DeleteOldVersionBgImageFromStorageIfNeeded = {
  storage: TrpcContext["storage"];
  input: RouterInputs["menus"]["createVersionWithNewProperties"];
  imageId: string | null;
  isLastVersionPublic: boolean;
};

export const createNewVersion = async (
  params: CreateNewVersionParams,
): Promise<CreatedMenuVersion> => {
  const { data, prisma } = params;
  try {
    return await prisma.menuVersion.create({
      data,
      select: {
        isPublic: true,
        title: true,
        subtitle: true,
        bgImageId: true,
      },
    });
  } catch (e) {
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error creating new version",
    });
  }
};

export const deleteOldVersionBgImageFromStorageIfNeeded = async ({
  storage,
  input,
  imageId,
  isLastVersionPublic,
}: DeleteOldVersionBgImageFromStorageIfNeeded) => {
  if (isLastVersionPublic) return;

  const shouldDelete =
    input.properties.deleteImage || input.properties.image !== null;

  if (shouldDelete && imageId) {
    try {
      await storage.deleteImage(imageId);
    } catch (e) {
      throw new trpc.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error deleting image",
      });
    }
  }
};

// ---
// --- archivo a testear: <create-version-with-new-properties.procedure.ts>
import type { PrismaClient } from "@prisma/client";

import { protectedProcedure } from "~/server/api/trpc";
import { deleteOldVersionIfNotPublic } from "../shared/behaviours/delete-old-version-if-not-public/delete-old-version-if-not-public.behaviour";
import { getLastMenuVersion } from "../shared/behaviours/get-latest-version/get-latest-version.behaviour";
import {
  createNewVersion,
  createNewVersionData,
  deleteOldVersionBgImageFromStorageIfNeeded,
} from "./create-version-with-new-properties.behaviour";
import {
  createVersionWithPropertiesInputSchema,
  createVersionWithPropertiesOutputSchema,
} from "./create-version-with-new-properties.schema";

export const createVersionWithPropertiesProcedure = protectedProcedure
  .input(createVersionWithPropertiesInputSchema)
  .output(createVersionWithPropertiesOutputSchema)
  .mutation(async ({ ctx, input }) => {
    const lastVersion = await getLastMenuVersion({
      prisma: ctx.prisma,
      menuId: input.menuId,
    });

    const newVersionData = await createNewVersionData({
      lastVersion,
      input,
      storage: ctx.storage,
    });

    const newVersion = await ctx.prisma.$transaction(async (prisma) => {
      const createdVersion = await createNewVersion({
        data: newVersionData,
        prisma: prisma as PrismaClient,
      });

      await deleteOldVersionIfNotPublic({
        lastVersion,
        prisma: ctx.prisma,
      });

      return createdVersion;
    });

    await deleteOldVersionBgImageFromStorageIfNeeded({
      storage: ctx.storage,
      input,
      imageId: lastVersion.bgImageId,
      isLastVersionPublic: lastVersion.isPublic,
    });

    return {
      menuId: input.menuId,
      properties: {
        isPublic: newVersion.isPublic,
        title: newVersion.title,
        subtitle: newVersion.subtitle,
        image: newVersion.bgImageId,
      },
    };
  });
// ---
// Tarea:
// Fragmento de una respuesta de ejemplo para una función llamada createNewVersionData:
// ---
describe("createNewVersionData", () => {
    // En el caso de que se necesiten mocks se definen aquí
  const storageMock = mockDeep<TrpcContext["storage"]>();

  afterEach(() => {
    mockReset(storageMock);
  });

  it("should call image storage service once with a new image", async () => {
    // const lastVersion: MenuVersionQuery = {}
    // const input: RouterInputs["menus"]["createVersionWithNewProperties"] = {}
    // const testParams: CreateNewVersionDataParams = {}
    

});
  it("should throw if image upload service fails", async () => {
    // const lastVersion: MenuVersionQuery = {}
    // const input: RouterInputs["menus"]["createVersionWithNewProperties"] = {}
    // const testParams: CreateNewVersionDataParams = {}
  });
  it("when input deleteImage is true should return new version data and image id as null", async () => {
    // const lastVersion: MenuVersionQuery = {};
    // const input: RouterInputs["menus"]["createVersionWithNewProperties"] = {};
    // const testParams: CreateNewVersionDataParams = {};
  });
  it("when new image should return new version data and image id", async () => {
    // const lastVersion: MenuVersionQuery = {};
    // const input: RouterInputs["menus"]["createVersionWithNewProperties"] = {};
    // const testParams: CreateNewVersionDataParams = {};
  });
  it("when new no new image and no deleteImage should return new version data and last version image id", async () => {
    // const lastVersion: MenuVersionQuery = {};
    // const input: RouterInputs["menus"]["createVersionWithNewProperties"] = {};
    // const testParams: CreateNewVersionDataParams = {};
  });
});
// ---
// Tarea: Genera una respuesta como la del ejemplo pero adaptada a los archivos que necesito testear.
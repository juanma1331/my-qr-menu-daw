import { beforeEach, describe, expect, it } from "vitest";

import type { RouterInputs } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { clearAllTables, createTestContext } from "../../test-utils";

describe("createVersionWithPropertiesProcedure", () => {
  type Input = RouterInputs["menus"]["createVersionWithNewProperties"];

  beforeEach(async () => {
    await clearAllTables();
  });

  it("should create a new version with properties and delete last version if not public", async () => {
    // Arrange
    const { ctx, user } = createTestContext({ id: "1", role: "USER" });
    const caller = appRouter.createCaller(ctx);
    const testInput: Input = {
      menuId: "menu-id",
      properties: {
        title: "Title",
        subtitle: "Subtitle",
        image: null,
        deleteImage: false,
      },
    };

    await prisma.user.create({
      data: {
        ...user,
        menus: {
          create: {
            id: "menu-id",
            qrId: "qr-id",
            versions: {
              create: {
                isPublic: false,
                title: "Title",
                subtitle: "Subtitle",
              },
            },
          },
        },
      },
    });

    // Act
    await caller.menus.createVersionWithNewProperties(testInput);

    // Assert
    const versions = await prisma.menuVersion.findMany();
    expect(versions).toHaveLength(1);
    expect(versions[0]?.isPublic).toBe(false);
    expect(versions[0]?.title).toBe(testInput.properties.title);
    expect(versions[0]?.subtitle).toBe(testInput.properties.subtitle);
  });

  it("should create a new version with properties and not delete last version if public", async () => {
    // Arrange
    const { ctx, user } = createTestContext({ id: "1", role: "USER" });
    const caller = appRouter.createCaller(ctx);
    const testInput: Input = {
      menuId: "menu-id",
      properties: {
        title: "Title",
        subtitle: "Subtitle",
        image: null,
        deleteImage: false,
      },
    };

    await prisma.user.create({
      data: {
        ...user,
        menus: {
          create: {
            id: "menu-id",
            qrId: "qr-id",
            versions: {
              create: {
                isPublic: true,
                title: "Title",
                subtitle: "Subtitle",
              },
            },
          },
        },
      },
    });

    // Act
    await caller.menus.createVersionWithNewProperties(testInput);

    // Assert
    const versions = await prisma.menuVersion.findMany({
      orderBy: { createdAt: "desc" },
    });
    expect(versions).toHaveLength(2);
    expect(versions[0]?.isPublic).toBe(false);
    expect(versions[0]?.title).toStrictEqual(testInput.properties.title);
    expect(versions[0]?.subtitle).toStrictEqual(testInput.properties.subtitle);
  });
});

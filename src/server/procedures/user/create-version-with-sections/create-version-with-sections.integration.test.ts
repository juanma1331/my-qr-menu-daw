import { beforeEach, describe, expect, it } from "vitest";

import type { RouterInputs } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { clearAllTables, createTestContext } from "../../test-utils";

describe("createVersionWithSectionsProcedure", () => {
  type Input = RouterInputs["menus"]["createVersionWithSections"];

  beforeEach(async () => {
    await clearAllTables();
  });

  it("creates a new version with sections and delete previous version if not public", async () => {
    // Arrange
    const { ctx, user } = createTestContext({ id: "1", role: "USER" });
    const caller = appRouter.createCaller(ctx);
    const testInput: Input = {
      menuId: "menu-id",
      sections: [
        {
          id: null,
          name: "Section 1",
        },
      ],
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
                title: "Version 1",
                isPublic: false,
              },
            },
          },
        },
      },
    });

    // Act
    await caller.menus.createVersionWithSections(testInput);

    // Assert
    const version = await prisma.menuVersion.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        sections: true,
      },
    });
    expect(version[0]?.sections.length).toBe(1);
  });

  it("creates a new version with sections and keeps previous version when it is public", async () => {
    // Arrange
    const { ctx, user } = createTestContext({ id: "1", role: "USER" });
    const caller = appRouter.createCaller(ctx);
    const testInput: Input = {
      menuId: "menu-id",
      sections: [
        {
          id: null,
          name: "Section 1",
        },
      ],
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
                title: "Version 1",
                isPublic: true,
              },
            },
          },
        },
      },
    });

    // Act
    await caller.menus.createVersionWithSections(testInput);

    // Assert
    const versions = await prisma.menuVersion.findMany();
    expect(versions).toHaveLength(2);
  });
});

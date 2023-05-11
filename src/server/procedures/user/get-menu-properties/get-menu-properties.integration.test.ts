import { beforeEach, describe, expect, it } from "vitest";

import type { RouterInputs } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { clearAllTables, createTestContext } from "../../test-utils";

describe("getMenuPropertiesProcedure", () => {
  type Input = RouterInputs["menus"]["getMenuProperties"];

  beforeEach(async () => {
    await clearAllTables();
  });

  it("should return latest version properties", async () => {
    // Arrange
    const { ctx, user } = createTestContext({ id: "user-id", role: "USER" });
    const caller = appRouter.createCaller(ctx);
    const testInput: Input = {
      menuId: "menu-id",
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
                title: "version-title",
              },
            },
          },
        },
      },
    });

    // Act
    const result = await caller.menus.getMenuProperties(testInput);

    // Assert
    expect(result.properties.isPublic).toBe(false);
    expect(result.properties.title).toBe("version-title");
  });
});

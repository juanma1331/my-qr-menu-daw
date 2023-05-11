import { beforeEach, describe, expect, it } from "vitest";

import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { clearAllTables, createTestContext } from "../../test-utils";

describe("getMenusInfoProcedure", () => {
  beforeEach(async () => {
    await clearAllTables();
  });

  it("should return menus info", async () => {
    // Arrange
    const { ctx, user } = createTestContext({ id: "user-id", role: "USER" });
    const caller = appRouter.createCaller(ctx);

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
    const result = await caller.menus.getMenusInfo();

    // Assert
    expect(result.menus.length).toBe(1);
  });
});

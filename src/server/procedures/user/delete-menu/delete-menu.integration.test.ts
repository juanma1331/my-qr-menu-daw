import { beforeEach, describe, expect, it } from "vitest";

import type { RouterInputs } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { clearAllTables, createTestContext } from "../../test-utils";

describe("deleteMenuProcedure", () => {
  type Input = RouterInputs["menus"]["deleteMenu"];

  beforeEach(async () => {
    await clearAllTables();
  });

  it("should delete a menu by ud", async () => {
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
          },
        },
      },
    });

    // Act
    await caller.menus.deleteMenu(testInput);

    // Assert
    const menus = await prisma.menu.findMany();
    expect(menus).toHaveLength(0);
  });
});

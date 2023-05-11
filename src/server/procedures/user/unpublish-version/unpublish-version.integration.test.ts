import { beforeEach, describe, expect, it } from "vitest";

import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { clearAllTables, createTestContext } from "../../test-utils";
import type { RouterInputs } from "./../../../../utils/api";

describe("unpublishMenuVersionProcedure", () => {
  type Input = RouterInputs["menus"]["unpublishMenuVersion"];

  beforeEach(async () => {
    await clearAllTables();
  });

  it("should unpublish the version", async () => {
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
              create: [
                {
                  id: 1,
                  title: "public-title",
                  isPublic: true,
                },
              ],
            },
          },
        },
      },
    });

    // Act
    await caller.menus.unpublishMenuVersion(testInput);

    // Assert
    const version = await prisma.menuVersion.findUnique({
      where: { id: 1 },
    });
    expect(version?.isPublic).toBe(false);
  });
});

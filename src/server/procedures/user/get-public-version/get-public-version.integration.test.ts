import { beforeEach, describe, expect, it } from "vitest";

import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { clearAllTables, createTestContext } from "../../test-utils";
import type { RouterInputs } from "./../../../../utils/api";

describe("getPublicVersionProcedure", () => {
  type Input = RouterInputs["menus"]["getPublicVersion"];

  beforeEach(async () => {
    await clearAllTables();
  });

  it("should return a public version", async () => {
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
                  title: "public-title",
                  isPublic: true,
                },

                {
                  title: "private-title",
                  isPublic: false,
                },
              ],
            },
          },
        },
      },
    });

    // Act
    const result = await caller.menus.getPublicVersion(testInput);

    // Assert
    expect(result.version?.title).toBe("public-title");
  });
});

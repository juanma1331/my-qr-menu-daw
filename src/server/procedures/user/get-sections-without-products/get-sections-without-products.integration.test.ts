import { beforeEach, describe, expect, it } from "vitest";

import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { clearAllTables, createTestContext } from "../../test-utils";
import type { RouterInputs } from "./../../../../utils/api";

describe("getPublicVersionProcedure", () => {
  type Input = RouterInputs["menus"]["getSectionsWithoutProducts"];

  beforeEach(async () => {
    await clearAllTables();
  });

  it("should return sections without products", async () => {
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
                  sections: {
                    create: [
                      {
                        name: "public-name",
                        position: 1,
                      },
                      {
                        name: "public-name",
                        position: 2,
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    });

    // Act
    const result = await caller.menus.getSectionsWithoutProducts(testInput);

    // Assert
    expect(result.sections.length).toBe(2);
  });
});

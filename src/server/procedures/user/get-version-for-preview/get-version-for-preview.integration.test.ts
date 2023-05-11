import { beforeEach, describe, expect, it } from "vitest";

import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { clearAllTables, createTestContext } from "../../test-utils";
import type { RouterInputs } from "./../../../../utils/api";

describe("getVersionForPreviewProcedure", () => {
  type Input = RouterInputs["menus"]["getVersionForPreview"];

  beforeEach(async () => {
    await clearAllTables();
  });

  it("should return last version with sections and products", async () => {
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
    const result = await caller.menus.getVersionForPreview(testInput);

    // Assert
    expect(result.version.sections.length).toBe(2);
  });
});

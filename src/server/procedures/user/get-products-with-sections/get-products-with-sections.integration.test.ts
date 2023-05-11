import { beforeEach, describe, expect, it } from "vitest";

import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { clearAllTables, createTestContext } from "../../test-utils";
import type { RouterInputs } from "./../../../../utils/api";

describe("getProductsWithSectionsProcedure", () => {
  type Input = RouterInputs["menus"]["getProductsWithSections"];

  beforeEach(async () => {
    await clearAllTables();
  });

  it("should return procucts with sections", async () => {
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
                sections: {
                  create: {
                    name: "section-name",
                    position: 1,
                    products: {
                      create: {
                        id: 1,
                        name: "product-name",
                        imageId: "image-id",
                        price: 1,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Act
    const result = await caller.menus.getProductsWithSections(testInput);

    // Assert
    expect(result.products[0]?.section).toBeDefined();
  });
});

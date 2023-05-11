import { beforeEach, describe, expect, it } from "vitest";

import type { RouterInputs } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { clearAllTables, createTestContext } from "../../test-utils";

describe("createVersionWithoutDeletedProductProcedure", () => {
  type Input = RouterInputs["menus"]["createVersionWithoutDeletedProduct"];

  beforeEach(async () => {
    await clearAllTables();
  });

  it("creates new version without deleted product when product exists", async () => {
    // Arrange
    const { ctx, user } = createTestContext({ id: "user-id", role: "USER" });
    const caller = appRouter.createCaller(ctx);
    const testInput: Input = {
      menuId: "menu-id",
      productId: 1,
    };
    // The database should have a user with a menu and one product.

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
    await caller.menus.createVersionWithoutDeletedProduct(testInput);

    // Assert
    const products = await prisma.product.findMany();
    expect(products).toHaveLength(0);
  });
});

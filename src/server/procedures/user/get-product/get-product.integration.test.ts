import { beforeEach, describe, expect, it } from "vitest";

import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { clearAllTables, createTestContext } from "../../test-utils";
import type { RouterInputs } from "./../../../../utils/api";

describe("getProductProcedure", () => {
  type Input = RouterInputs["menus"]["getProduct"];

  beforeEach(async () => {
    await clearAllTables();
  });

  it("should return a product by id", async () => {
    // Arrange
    const { ctx, user } = createTestContext({ id: "user-id", role: "USER" });
    const caller = appRouter.createCaller(ctx);
    const testInput: Input = {
      id: 1,
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
    const result = await caller.menus.getProduct(testInput);

    // Assert
    expect(result.product.id).toBe(1);
  });
});

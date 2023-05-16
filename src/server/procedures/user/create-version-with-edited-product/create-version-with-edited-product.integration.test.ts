import { beforeEach, describe, expect, it } from "vitest";

import type { RouterInputs } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { clearAllTables, createTestContext } from "../../test-utils";

describe("createVersionWithEditedProductProcedure", () => {
  type Input = RouterInputs["menus"]["createVersionWithEditedProduct"];

  beforeEach(async () => {
    // Agregar limpieza
    await clearAllTables();
  });

  it("should create a new version with edited product and delete last version when is not public", async () => {
    // Arrange
    const { ctx, user } = createTestContext({ id: "user-id", role: "USER" });
    const caller = appRouter.createCaller(ctx);
    const testInput: Input = {
      menuId: "menu-id",
      sectionId: 1,
      product: {
        id: 1,
        name: "Producto 1",
        description: null,
        currentImageId: "current-image-id",
        image: null,
        price: 10,
      },
    };

    await prisma.user.create({
      data: {
        ...user,
        menus: {
          create: {
            id: testInput.menuId,
            qrId: "qr-id",
            versions: {
              create: {
                title: "Version 1",
                isPublic: false,
                sections: {
                  create: {
                    id: 1,
                    name: "Section 1",
                    position: 1,
                    products: {
                      create: {
                        id: 1,
                        name: testInput.product.name,
                        imageId: testInput.product.currentImageId,
                        price: testInput.product.price,
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
    await caller.menus.createVersionWithEditedProduct(testInput);

    // Assert
    const versions = await prisma.menuVersion.findMany();
    const products = await prisma.product.findMany();

    expect(versions.length).toEqual(1);
    expect(products.length).toEqual(1);
  });

  it("should create a new version with edited product and not delete the old version when last version is public", async () => {
    // Arrange
    const { ctx, user } = createTestContext({ id: "user-id", role: "USER" });
    const caller = appRouter.createCaller(ctx);
    const testInput: Input = {
      menuId: "menu-id",
      sectionId: 1,
      product: {
        id: 1,
        name: "Producto 1",
        description: null,
        currentImageId: "current-image-id",
        image: null,
        price: 10,
      },
    };

    await prisma.user.create({
      data: {
        ...user,
        menus: {
          create: {
            id: testInput.menuId,
            qrId: "qr-id",
            versions: {
              create: {
                title: "Version 1",
                isPublic: true,
                sections: {
                  create: {
                    id: 1,
                    name: "Section 1",
                    position: 1,
                    products: {
                      create: {
                        id: 1,
                        name: testInput.product.name,
                        imageId: testInput.product.currentImageId,
                        price: testInput.product.price,
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
    await caller.menus.createVersionWithEditedProduct(testInput);

    // Assert
    const versions = await prisma.menuVersion.findMany();
    const products = await prisma.product.findMany();

    expect(versions.length).toEqual(2);
    expect(products.length).toEqual(2);
  });

  it("should throw an error if the menu does not exist", async () => {
    // Arrange
    const { ctx, user } = createTestContext({ id: "user-id", role: "USER" });
    const caller = appRouter.createCaller(ctx);
    const testInput: Input = {
      menuId: "menu-id",
      sectionId: 1,
      product: {
        id: 1,
        name: "Producto 1",
        description: null,
        currentImageId: "current-image-id",
        image: null,
        price: 10,
      },
    };

    await prisma.user.create({
      data: {
        ...user,
        menus: {
          create: {
            id: "other-menu-id",
            qrId: "qr-id",
            versions: {
              create: {
                title: "Version 1",
                isPublic: false,
                sections: {
                  create: {
                    name: "Section 1",
                    position: 1,
                    products: {
                      create: {
                        id: 1,
                        name: testInput.product.name,
                        imageId: testInput.product.currentImageId,
                        price: testInput.product.price,
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

    try {
      // Act
      await caller.menus.createVersionWithEditedProduct(testInput);
      expect(true).toBe(false);
    } catch (e) {
      // Assert
      expect(e).toBeInstanceOf(Error);
    }
  });
});

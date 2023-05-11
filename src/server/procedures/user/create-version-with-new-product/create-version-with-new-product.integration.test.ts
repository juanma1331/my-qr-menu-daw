import { beforeEach, describe, expect, it } from "vitest";

import type { RouterInputs } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { clearAllTables, createTestContext } from "../../test-utils";

describe("createVersionWithNewProductProcedure", () => {
  type Input = RouterInputs["menus"]["createVersionWithNewProduct"];

  beforeEach(async () => {
    await clearAllTables();
  });

  it("should create a new version with new product and all last version products", async () => {
    // Arrange
    const { ctx, user } = createTestContext({ id: "1", role: "USER" });
    const caller = appRouter.createCaller(ctx);
    const testInput: Input = {
      menuId: "menu-id",
      sectionId: 1,
      product: {
        name: "Producto 1",
        description: null,
        image: {
          name: "image.jpg",
          type: "image/jpg",
          size: 10,
          data: "image-base64",
        },
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
                    id: testInput.sectionId,
                    name: "Section 1",
                    position: 1,
                    products: {
                      create: {
                        id: 1,
                        name: "Producto 1",
                        imageId: "image-id",
                        price: 12,
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
    await caller.menus.createVersionWithNewProduct(testInput);

    // Assert
    const products = await prisma.product.findMany();
    expect(products.length).toEqual(2);
  });

  it("should create a new version with a new product and delete the last version if not public", async () => {
    // Arrange
    const { ctx, user } = createTestContext({ id: "1", role: "USER" });
    const caller = appRouter.createCaller(ctx);
    const testInput: Input = {
      menuId: "menu-id",
      sectionId: 1,
      product: {
        name: "Producto 1",
        description: null,
        image: {
          name: "image.jpg",
          type: "image/jpg",
          size: 10,
          data: "image-base64",
        },
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
                    id: testInput.sectionId,
                    name: "Section 1",
                    position: 1,
                    products: {
                      create: {
                        id: 1,
                        name: "Producto 1",
                        imageId: "image-id",
                        price: 12,
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
    await caller.menus.createVersionWithNewProduct(testInput);

    // Assert
    const versions = await prisma.menuVersion.findMany();
    const products = await prisma.product.findMany();
    expect(products.length).toEqual(2);
    expect(versions.length).toEqual(1);
  });

  it("should create a new version with a new product and not delete the last version if public", async () => {
    // Arrange
    const { ctx, user } = createTestContext({ id: "1", role: "USER" });
    const caller = appRouter.createCaller(ctx);
    const testInput: Input = {
      menuId: "menu-id",
      sectionId: 1,
      product: {
        name: "Producto 1",
        description: null,
        image: {
          name: "image.jpg",
          type: "image/jpg",
          size: 10,
          data: "image-base64",
        },
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
                    id: testInput.sectionId,
                    name: "Section 1",
                    position: 1,
                    products: {
                      create: {
                        id: 1,
                        name: "Producto 1",
                        imageId: "image-id",
                        price: 12,
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
    await caller.menus.createVersionWithNewProduct(testInput);

    // Assert
    const versions = await prisma.menuVersion.findMany();
    const products = await prisma.product.findMany();
    expect(products.length).toEqual(3);
    expect(versions.length).toEqual(2);
  });
});

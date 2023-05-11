import { beforeEach, describe, expect, it } from "vitest";

import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { clearAllTables, createTestContext } from "../../test-utils";
import type { RouterInputs } from "./../../../../utils/api";

describe("publishMenuVersionProcedure", () => {
  type Input = RouterInputs["menus"]["publishMenuVersion"];

  beforeEach(async () => {
    await clearAllTables();
  });

  it("should publish the version", async () => {
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
                  isPublic: false,
                  sections: {
                    create: {
                      name: "public-name",
                      position: 1,
                      products: {
                        create: {
                          name: "public-name",
                          price: 1,
                          imageId: "image-id",
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    });

    // Act
    await caller.menus.publishMenuVersion(testInput);

    // Assert
    const version = await prisma.menuVersion.findUnique({
      where: { id: 1 },
    });
    expect(version?.isPublic).toBe(true);
  });

  it("should not publish it version has no sections", async () => {
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
                  isPublic: false,
                },
              ],
            },
          },
        },
      },
    });

    // Act
    const result = await caller.menus.publishMenuVersion(testInput);

    // Assert
    expect(result.publishStatus).toBe("no-sections");
  });

  it("should not publish it version has empty sections", async () => {
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
                  isPublic: false,
                  sections: {
                    create: {
                      name: "public-name",
                      position: 1,
                    },
                  },
                },
              ],
            },
          },
        },
      },
    });

    // Act
    const result = await caller.menus.publishMenuVersion(testInput);

    // Assert
    expect(result.publishStatus).toBe("empty-section");
  });

  it("should delete the last public version", async () => {
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
                  createdAt: new Date("2022-01-01"),
                  sections: {
                    create: {
                      name: "public-name",
                      position: 1,
                      products: {
                        create: {
                          name: "public-name",
                          imageId: "image-id",
                          price: 1,
                        },
                      },
                    },
                  },
                },
                {
                  title: "public-title",
                  isPublic: false,
                  createdAt: new Date("2022-01-02"),
                  sections: {
                    create: {
                      name: "public-name",
                      position: 1,
                      products: {
                        create: {
                          name: "public-name",
                          imageId: "image-id-2",
                          price: 1,
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    });

    // Act
    await caller.menus.publishMenuVersion(testInput);

    // Assert
    const versions = await prisma.menuVersion.findMany();
    expect(versions.length).toBe(1);
  });
});

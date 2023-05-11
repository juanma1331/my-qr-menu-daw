import { beforeEach, describe, expect, it } from "vitest";

import type { RouterInputs } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { clearAllTables, createTestContext } from "../../test-utils";

describe("createMenuAndVersionProcedure", () => {
  type Input = RouterInputs["menus"]["createMenuAndVersion"];

  beforeEach(async () => {
    await clearAllTables();
  });

  it("should create a new menu and version when allowed", async () => {
    // Arrange
    const { ctx, user } = createTestContext({ id: "1", role: "USER" });
    const caller = appRouter.createCaller(ctx);
    const testInput: Input = { title: "Test Menu" };

    await prisma.user.create({
      data: {
        ...user,
        menuCreationLimit: 2,
        menus: {
          create: {
            qrId: "",
            createdAt: new Date(),
          },
        },
      },
    });

    // Act
    const result = (await caller.menus.createMenuAndVersion(testInput)) as {
      creationStatus: "allowed";
      menuId?: string;
    };

    // Assert
    expect(result.creationStatus).toEqual("allowed");

    expect(result.menuId).toBeDefined();
  });

  it("should not create a new menu and version when not allowed", async () => {
    const { ctx, user } = createTestContext({ id: "1", role: "USER" });
    const caller = appRouter.createCaller(ctx);
    const testInput: Input = { title: "Test Menu" };

    await prisma.user.create({
      data: {
        ...user,
        menuCreationLimit: 1,
        menus: {
          create: {
            qrId: "",
            createdAt: new Date(),
          },
        },
      },
    });

    // Act
    const result = (await caller.menus.createMenuAndVersion(testInput)) as {
      creationStatus: "not-allowed";
      menuId?: string;
    };

    // Assert
    expect(result.creationStatus).toEqual("not-allowed");

    expect(result.menuId).toBeUndefined();
  });

  it("should handle errors during menu and version creation", async () => {
    // Arrange
    const { ctx } = createTestContext({ id: "1", role: "USER" });
    const caller = appRouter.createCaller(ctx);
    const testInput: Input = { title: "" }; // Invalid input

    // Act
    try {
      await caller.menus.createMenuAndVersion(testInput);
      expect(true).toEqual(false); // Should not reach this line
    } catch (error) {
      // Assert
      expect(error).toBeDefined();
    }
  });
});

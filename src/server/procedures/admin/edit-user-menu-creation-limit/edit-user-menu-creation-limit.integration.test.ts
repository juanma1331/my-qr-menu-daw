import { beforeEach, describe, expect, it } from "vitest";

import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { clearAllTables, createTestContext } from "../../test-utils";
import type { RouterInputs } from "./../../../../utils/api";

describe("editUserMenuCreationLimitProcedure", () => {
  type Input = RouterInputs["menus"]["editUserMenuCreationLimit"];

  beforeEach(async () => {
    await clearAllTables();
  });

  it("should update menu creation limit on user", async () => {
    // Arrange
    const { ctx, user } = createTestContext({ id: "user-id", role: "ADMIN" });
    const caller = appRouter.createCaller(ctx);
    const testInput: Input = {
      userId: user.id,
      menuCreationLimit: 10,
    };

    await prisma.user.create({
      data: {
        ...user,
      },
    });

    // Act
    const result = await caller.menus.editUserMenuCreationLimit(testInput);

    // Assert
    expect(result.updatedUser.menuCreationLimit).toBe(
      testInput.menuCreationLimit,
    );
  });
});

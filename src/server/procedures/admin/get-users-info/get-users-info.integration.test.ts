import { beforeEach, describe, expect, it } from "vitest";

import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { clearAllTables, createTestContext } from "../../test-utils";
import type { RouterInputs } from "./../../../../utils/api";

describe("getUsersInfoProcedure", () => {
  type Input = RouterInputs["menus"]["getUsersInfo"];

  beforeEach(async () => {
    await clearAllTables();
  });

  it("should return a collection of user info", async () => {
    // Arrange
    const { ctx, user } = createTestContext({ id: "user-id", role: "ADMIN" });
    const caller = appRouter.createCaller(ctx);

    await prisma.user.createMany({
      data: [
        {
          ...user,
        },
        {
          role: "USER",
        },
      ],
    });

    // Act
    const result = await caller.menus.getUsersInfo();

    // Assert
    expect(result.users.length).toBe(1);
  });
});

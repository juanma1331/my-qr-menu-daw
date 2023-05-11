import type { User } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

import type { TrpcContext } from "~/server/api/trpc";
import {
  updateUserMenuCreationLimitOnDB,
  type UpdateUserMenuCreationLimitOnDB,
} from "./edit-user-menu-creation-limit.behaviour";
import type { UpdatedUser } from "./edit-user-menu-creation-limit.types";

describe("updateUserMenuCreationLimitOnDB", () => {
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  type TestUser = {
    id: string;
    email: string;
    menuCreationLimit: number;
    createdMenus: number;
    _count: {
      menus: number;
    };
  };

  afterEach(() => {
    mockReset(prismaMock);
  });

  it("should update the user menu creation limit", async () => {
    // Arrange
    const testParams: UpdateUserMenuCreationLimitOnDB = {
      userId: "1",
      newLimit: 10,
      prisma: prismaMock,
    };
    const testUser: TestUser = {
      id: "1",
      email: "",
      menuCreationLimit: 10,
      createdMenus: 0,
      _count: {
        menus: 0,
      },
    };

    prismaMock.user.update.mockResolvedValueOnce(testUser as unknown as User);

    // Act
    await updateUserMenuCreationLimitOnDB(testParams);

    // Assert
    expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: {
        id: testParams.userId,
      },
      data: {
        menuCreationLimit: testParams.newLimit,
      },
      select: {
        id: true,
        email: true,
        menuCreationLimit: true,
        _count: {
          select: {
            menus: true,
          },
        },
      },
    });
  });

  it("should return an updated user object", async () => {
    // Arrange
    const testParams: UpdateUserMenuCreationLimitOnDB = {
      userId: "1",
      newLimit: 10,
      prisma: prismaMock,
    };

    const testUser: TestUser = {
      id: "1",
      email: "",
      menuCreationLimit: 10,
      createdMenus: 0,
      _count: {
        menus: 0,
      },
    };

    const updatedUser: UpdatedUser = {
      createdMenus: 0,
      id: "1",
      email: "",
      menuCreationLimit: 10,
    };

    prismaMock.user.update.mockResolvedValueOnce(testUser as unknown as User);

    // Act
    const result = await updateUserMenuCreationLimitOnDB(testParams);

    // Assert
    expect(result).toEqual(updatedUser);
  });

  it("should throw if prisma update fails", async () => {
    // Arrange
    const testParams: UpdateUserMenuCreationLimitOnDB = {
      userId: "1",
      newLimit: 10,
      prisma: prismaMock,
    };

    // Act
    await prismaMock.user.update.mockRejectedValueOnce(
      new Error("Error updating user menu creation limit"),
    );

    // Assert
    expect(updateUserMenuCreationLimitOnDB(testParams)).rejects.toThrow();
  });
});

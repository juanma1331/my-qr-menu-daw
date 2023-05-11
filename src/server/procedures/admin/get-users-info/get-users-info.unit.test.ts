import type { User } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

import type { TrpcContext } from "~/server/api/trpc";
import { findUsers, type FindUsersParams } from "./get-users-info.behaviour";
import type { UserQuery } from "./get-users-info.types";

describe("findUsers", () => {
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  type TestUser = {
    id: string;
    email: string;
    menuCreationLimit: number;
    _count: {
      menus: number;
    };
  };

  afterEach(() => {
    mockReset(prismaMock);
  });

  it("should return a list of users with correct properties", async () => {
    // Arrange
    const testParams: FindUsersParams = {
      prisma: prismaMock,
    };

    const testUsers: TestUser[] = [
      {
        id: "1",
        email: "",
        menuCreationLimit: 10,
        _count: {
          menus: 1,
        },
      },
    ];

    const testUserQueries: UserQuery[] = [
      {
        id: "1",
        email: "",
        createdMenus: 1,
        menuCreationLimit: 10,
      },
    ];

    prismaMock.user.findMany.mockResolvedValue(
      testUsers as unknown[] as User[],
    );

    // Act
    const result = await findUsers(testParams);

    // Assert
    expect(result).toEqual(testUserQueries);
  });

  it("should call prisma with correct parameters", async () => {
    // Arrange
    const testParams: FindUsersParams = {
      prisma: prismaMock,
    };

    const testUsers: TestUser[] = [
      {
        id: "1",
        email: "",
        menuCreationLimit: 10,
        _count: {
          menus: 1,
        },
      },
    ];

    prismaMock.user.findMany.mockResolvedValue(
      testUsers as unknown[] as User[],
    );

    // Act
    await findUsers(testParams);
    // Assert
    expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {
        role: "USER",
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

  it("should throw an error if prisma query fails", async () => {
    // Arrange
    const testParams: FindUsersParams = {
      prisma: prismaMock,
    };

    const testUsers: TestUser[] = [
      {
        id: "1",
        email: "",
        menuCreationLimit: 10,
        _count: {
          menus: 1,
        },
      },
    ];

    prismaMock.user.findMany.mockResolvedValue(
      testUsers as unknown[] as User[],
    );

    // Act
    prismaMock.user.findMany.mockRejectedValue(new Error());

    // Assert
    await expect(findUsers(testParams)).rejects.toThrow();
  });
});

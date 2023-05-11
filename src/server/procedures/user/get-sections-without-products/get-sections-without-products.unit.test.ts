import type { MenuVersion } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

import type { TrpcContext } from "~/server/api/trpc";
import {
  findLatesVersion,
  type FindLatesVersionParams,
} from "./get-sections-without-products.behaviour";
import type { MenuVersionQuery } from "./get-sections-without-products.types";

describe("findLatesVersion", () => {
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  afterEach(() => {
    mockReset(prismaMock);
  });

  it("should return the latest version of the menu", async () => {
    // Arrange
    const menuId = "1";
    const testParams: FindLatesVersionParams = { menuId, prisma: prismaMock };

    const testVersion: MenuVersionQuery = {
      isPublic: true,
      sections: [
        {
          id: 1,
          name: "Section 1",
        },
      ],
    };

    prismaMock.menuVersion.findFirst.mockResolvedValue(
      testVersion as unknown as MenuVersion,
    );

    // Act
    const result = await findLatesVersion(testParams);

    // Assert
    expect(prismaMock.menuVersion.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.menuVersion.findFirst).toHaveBeenCalledWith({
      where: {
        menuId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        isPublic: true,
        sections: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    expect(result).toEqual(testVersion);
  });

  it("should throw when no version found", async () => {
    // Arrange
    const menuId = "";
    const testParams: FindLatesVersionParams = { menuId, prisma: prismaMock };

    // Act
    prismaMock.menuVersion.findFirst.mockResolvedValue(null);

    // Assert
    await expect(findLatesVersion(testParams)).rejects.toThrow();
  });
});

import { afterEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

import type { TrpcContext } from "~/server/api/trpc";
import {
  getLastMenuVersion,
  type GetLastVersionParams,
  type MenuVersionQuery,
} from "./get-latest-version.behaviour";

describe("getLastMenuVersion", () => {
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  afterEach(() => {
    mockReset(prismaMock);
  });

  it("should return the last menu version", async () => {
    // Arrange
    const menuId = "";
    const testParams: GetLastVersionParams = { prisma: prismaMock, menuId };
    const testVersions: MenuVersionQuery[] = [
      {
        id: 1,
        title: "test",
        subtitle: "test",
        bgImageId: "test",
        isPublic: true,
        createdAt: new Date(),
        menuId: "test",
        sections: [],
      },
    ];

    prismaMock.menuVersion.findMany.mockResolvedValue(testVersions);

    // Act
    const result = await getLastMenuVersion(testParams);

    // Assert
    expect(prismaMock.menuVersion.findMany).toHaveBeenCalledOnce();
    expect(prismaMock.menuVersion.findMany).toHaveBeenCalledWith({
      where: { menuId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        subtitle: true,
        bgImageId: true,
        isPublic: true,
        createdAt: true,
        menuId: true,
        sections: {
          select: {
            id: true,
            name: true,
            position: true,
            menuVersionId: true,
            products: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                imageId: true,
                sectionId: true,
              },
            },
          },
        },
      },
    });
    const testVersion = testVersions[0];
    expect(result).toEqual(testVersion);
  });

  it("should throw an error if lastVersion is undefined", async () => {
    // Arrange
    const menuId = "test";
    const testParams: GetLastVersionParams = { prisma: prismaMock, menuId };
    const testVersions: MenuVersionQuery[] = [];

    prismaMock.menuVersion.findMany.mockResolvedValue(testVersions);

    // Act
    // Assert
    expect(getLastMenuVersion(testParams)).rejects.toThrow();
  });
});

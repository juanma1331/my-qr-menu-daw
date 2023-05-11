import type { MenuVersion } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

import type { TrpcContext } from "~/server/api/trpc";
import {
  getLastPublicMenuVersion,
  type GetLastPublicMenuVersionParams,
} from "./get-public-version.behaviour";
import type { MenuVersionQuery } from "./get-public-version.types";

describe("getLastPublicMenuVersion", () => {
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  afterEach(() => {
    mockReset(prismaMock);
  });

  it("should return the last version of the menu", async () => {
    // Arrange
    const menuId = "1";
    const testParams: GetLastPublicMenuVersionParams = {
      menuId,
      prisma: prismaMock,
    };
    const testMenuVersion: MenuVersionQuery = {
      bgImageId: "1",
      subtitle: "subtitle",
      title: "title",
      sections: [
        {
          name: "section1",
          products: [
            {
              name: "product1",
              description: "description",
              price: 1,
              imageId: "1",
            },
          ],
        },
      ],
    };

    prismaMock.menuVersion.findFirst.mockResolvedValueOnce(
      testMenuVersion as unknown as MenuVersion,
    );

    // Act
    const result = await getLastPublicMenuVersion(testParams);

    // Assert
    expect(prismaMock.menuVersion.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.menuVersion.findFirst).toHaveBeenCalledWith({
      where: {
        menuId,
        isPublic: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        title: true,
        subtitle: true,
        bgImageId: true,
        sections: {
          select: {
            name: true,
            products: {
              select: {
                name: true,
                description: true,
                price: true,
                imageId: true,
              },
            },
          },
        },
      },
    });
    expect(result).toEqual(testMenuVersion);
  });

  it("should return null when no public menu version found", async () => {
    // Arrange
    const menuId = "1";
    const testParams: GetLastPublicMenuVersionParams = {
      menuId,
      prisma: prismaMock,
    };

    prismaMock.menuVersion.findFirst.mockResolvedValueOnce(null);

    // Act
    const result = await getLastPublicMenuVersion(testParams);

    // Assert
    expect(result).toBeNull();
  });

  it("should throw an error if prisma call fails", async () => {
    // Arrange
    const menuId = "1";
    const testParams: GetLastPublicMenuVersionParams = {
      menuId,
      prisma: prismaMock,
    };

    // Act
    prismaMock.menuVersion.findFirst.mockRejectedValueOnce(new Error());

    // Assert
    await expect(getLastPublicMenuVersion(testParams)).rejects.toThrow();
  });
});

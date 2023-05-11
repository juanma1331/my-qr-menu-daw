import type { MenuVersion } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

import type { TrpcContext } from "~/server/api/trpc";
import {
  findLatestVersion,
  type FindLatestVersionParams,
} from "./get-menu-properties.behaviour";
import type { VersionQuery } from "./get-menu-properties.types";

describe("findLatestVersion", () => {
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  afterEach(() => {
    mockReset(prismaMock);
  });

  it("should return latest version of a menu", async () => {
    // Arrange
    const menuId = "1";
    const testParams: FindLatestVersionParams = { prisma: prismaMock, menuId };
    const testVersion: VersionQuery = {
      bgImageId: "1",
      isPublic: true,
      subtitle: "subtitle",
      title: "title",
    };

    prismaMock.menuVersion.findFirst.mockResolvedValue(
      testVersion as unknown as MenuVersion,
    );

    // Act
    const result = await findLatestVersion(testParams);

    // Assert
    expect(result).toEqual(testVersion);
  });

  it("should throw when menu version not found", async () => {
    // Arrange
    const menuId = "1";
    const testParams: FindLatestVersionParams = { prisma: prismaMock, menuId };

    // Act
    prismaMock.menuVersion.findFirst.mockResolvedValue(null);

    // Assert
    await expect(findLatestVersion(testParams)).rejects.toThrow();
  });
});

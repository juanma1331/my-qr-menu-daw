import { afterEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

import type { TrpcContext } from "~/server/api/trpc";
import {
  deleteOldVersionIfNotPublic,
  type DeleteOldVersionIfNotPublicParams,
  type MenuVersionQuery,
} from "~/server/procedures/user/shared/behaviours/delete-old-version-if-not-public/delete-old-version-if-not-public.behaviour";

describe("deleteOldVersionIfNotPublic", () => {
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  afterEach(() => {
    mockReset(prismaMock);
  });

  it("should not call prisma delete when lastVersion is public", async () => {
    // Arrange
    const lastVersion: MenuVersionQuery = {
      id: 1,
      isPublic: true,
      bgImageId: "1",
      sections: [],
    };
    const testParams: DeleteOldVersionIfNotPublicParams = {
      prisma: prismaMock,
      lastVersion,
    };

    // Act
    await deleteOldVersionIfNotPublic(testParams);

    // Assert
    expect(prismaMock.menuVersion.delete).not.toHaveBeenCalled();
  });

  it("should call prisma delete when lastVersion is not public", async () => {
    // Arrange
    const lastVersion: MenuVersionQuery = {
      id: 1,
      isPublic: false,
      bgImageId: "1",
      sections: [],
    };
    const testParams: DeleteOldVersionIfNotPublicParams = {
      prisma: prismaMock,
      lastVersion,
    };

    // Act
    await deleteOldVersionIfNotPublic(testParams);

    // Assert
    expect(prismaMock.menuVersion.delete).toHaveBeenCalledTimes(1);
    expect(prismaMock.menuVersion.delete).toHaveBeenCalledWith({
      where: { id: lastVersion.id },
    });
  });

  it("should throw when prisma delete fails", async () => {
    // Arrange
    const lastVersion: MenuVersionQuery = {
      id: 1,
      isPublic: false,
      bgImageId: "1",
      sections: [],
    };
    const testParams: DeleteOldVersionIfNotPublicParams = {
      prisma: prismaMock,
      lastVersion,
    };

    // Act
    prismaMock.menuVersion.delete.mockRejectedValueOnce(
      new Error("Failed to delete old version from db"),
    );

    // Assert
    await expect(deleteOldVersionIfNotPublic(testParams)).rejects.toThrow();
  });
});

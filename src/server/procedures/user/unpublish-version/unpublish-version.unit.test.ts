import { afterEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

import type { TrpcContext } from "~/server/api/trpc";
import {
  updateMenuVersionIsPublicOnDb,
  type UpdateMenuVersionIsPublicOnDbParams,
} from "./unpublish-version.behaviour";

describe("updateMenuVersionIsPublicOnDb", () => {
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  afterEach(() => {
    mockReset(prismaMock);
  });

  it("should update menu version isPublic to false", async () => {
    // Arrange
    const testParams: UpdateMenuVersionIsPublicOnDbParams = {
      prisma: prismaMock,
      menuId: "some_menu_id",
    };

    // Act
    await updateMenuVersionIsPublicOnDb(testParams);

    // Assert
    expect(prismaMock.menuVersion.updateMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.menuVersion.updateMany).toHaveBeenCalledWith({
      where: {
        menuId: testParams.menuId,
        isPublic: true,
      },
      data: {
        isPublic: false,
      },
    });
  });

  it("should throw if update fails", async () => {
    // Arrange
    const testParams: UpdateMenuVersionIsPublicOnDbParams = {
      prisma: prismaMock,
      menuId: "some_menu_id",
    };

    // Act
    prismaMock.menuVersion.updateMany.mockRejectedValueOnce(
      new Error("Failed to update menu version isPublic on db"),
    );

    // Assert
    await expect(updateMenuVersionIsPublicOnDb(testParams)).rejects.toThrow();
  });
});

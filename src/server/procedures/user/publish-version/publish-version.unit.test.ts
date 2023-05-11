import type { Menu } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

import type { TrpcContext } from "~/server/api/trpc";
import {
  deleteOldPublicMenuVersionFromDbIfNeccessary,
  deletePublicMenuVersionImagesFromStorageIfNecessary,
  getLastMenuVersionAndPublicMenuVersion,
  hasAnyEmptySections,
  hasNoSections,
  publishMenuVersionOnDb,
  type DeleteOldPublicMenuVersionFromDbIfNecessaryParams,
  type DeletePublicMenuVersionImagesFromStorageIfNecessaryParams,
  type GetLastMenuVersionAndPublicMenuVersionParams,
  type PublishMenuVersionOnDbParams,
} from "./publish-version.behaviour";
import type { MenuVersionQuery } from "./publish-version.types";

describe("getLastMenuVersionAndPublicMenuVersion", () => {
  // En el caso de que se necesiten mocks se definen aquí
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  afterEach(() => {
    mockReset(prismaMock);
  });

  it("should return last and public menu version", async () => {
    // Arrange
    const testParams: GetLastMenuVersionAndPublicMenuVersionParams = {
      menuId: "1",
      prisma: prismaMock,
    };
    const testLastVersion: MenuVersionQuery = {
      id: 1,
      isPublic: false,
      bgImageId: null,
      sections: [
        {
          products: [
            {
              imageId: "1",
            },
          ],
        },
      ],
    };
    const testPublicVersion: MenuVersionQuery = {
      id: 1,
      isPublic: true,
      bgImageId: null,
      sections: [
        {
          products: [
            {
              imageId: "2",
            },
          ],
        },
      ],
    };
    const testMenu: { versions: MenuVersionQuery[] } = {
      versions: [testLastVersion, testPublicVersion],
    };

    prismaMock.menu.findUnique.mockResolvedValue(testMenu as unknown as Menu);

    // Act
    const result = await getLastMenuVersionAndPublicMenuVersion(testParams);

    // Assert
    expect(prismaMock.menu.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.menu.findUnique).toHaveBeenCalledWith({
      where: {
        id: testParams.menuId,
      },
      select: {
        versions: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            isPublic: true,
            bgImageId: true,
            sections: {
              select: {
                products: {
                  select: {
                    imageId: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    expect(result).toEqual({
      lastVersion: testLastVersion,
      publicVersion: testPublicVersion,
    });
  });

  it("should throw error if menu not found", async () => {
    // Arrange
    const testParams: GetLastMenuVersionAndPublicMenuVersionParams = {
      menuId: "1",
      prisma: prismaMock,
    };

    // Act
    prismaMock.menu.findUnique.mockResolvedValue(null);

    // Assert
    await expect(
      getLastMenuVersionAndPublicMenuVersion(testParams),
    ).rejects.toThrow();
  });

  it("should throw error if menu version not found", async () => {
    // Arrange
    const testParams: GetLastMenuVersionAndPublicMenuVersionParams = {
      menuId: "1",
      prisma: prismaMock,
    };

    const testMenu: { versions: MenuVersionQuery[] } = {
      versions: [],
    };

    // Act
    prismaMock.menu.findUnique.mockResolvedValue(testMenu as unknown as Menu);

    // Assert
    await expect(
      getLastMenuVersionAndPublicMenuVersion(testParams),
    ).rejects.toThrow();
  });
});

describe("hasNoSections", () => {
  it("should return true if version has no sections", () => {
    // Arrange
    const version: MenuVersionQuery = {
      id: 1,
      isPublic: true,
      bgImageId: null,
      sections: [],
    };

    // Act
    const result = hasNoSections(version);

    // Assert
    expect(result).toBe(true);
  });

  it("should return false if version has sections", () => {
    // Arrange
    const version: MenuVersionQuery = {
      id: 1,
      isPublic: true,
      bgImageId: null,
      sections: [
        {
          products: [
            {
              imageId: "1",
            },
          ],
        },
      ],
    };

    // Act
    const result = hasNoSections(version);

    // Assert
    expect(result).toBe(false);
  });
});

describe("hasAnyEmptySections", () => {
  it("should return true if any section is empty", () => {
    // Arrange
    const version: MenuVersionQuery = {
      id: 1,
      isPublic: true,
      bgImageId: null,
      sections: [
        {
          products: [],
        },
      ],
    };

    // Act
    const result = hasAnyEmptySections(version);

    // Assert
    expect(result).toBe(true);
  });

  it("should return false if all sections have products", () => {
    // Arrange
    const version: MenuVersionQuery = {
      id: 1,
      isPublic: true,
      bgImageId: null,
      sections: [
        {
          products: [
            {
              imageId: "1",
            },
          ],
        },
        {
          products: [
            {
              imageId: "2",
            },
          ],
        },
      ],
    };

    // Act
    const result = hasAnyEmptySections(version);

    // Assert
    expect(result).toBe(false);
  });
});

describe("publishMenuVersionOnDb", () => {
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  afterEach(() => {
    mockReset(prismaMock);
  });

  it("should successfully update menu version on db", async () => {
    // Arrange
    const testParams: PublishMenuVersionOnDbParams = {
      lastVersionId: 1,
      prisma: prismaMock,
    };

    // Act
    await publishMenuVersionOnDb(testParams);
    // Assert
    expect(prismaMock.menuVersion.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.menuVersion.update).toHaveBeenCalledWith({
      where: {
        id: testParams.lastVersionId,
      },
      data: {
        isPublic: true,
      },
    });
  });

  it("should throw error if update menu version on db fails", async () => {
    // Arrange
    const testParams: PublishMenuVersionOnDbParams = {
      lastVersionId: 1,
      prisma: prismaMock,
    };
    // Act
    prismaMock.menuVersion.update.mockRejectedValue(new Error());

    // Assert
    await expect(publishMenuVersionOnDb(testParams)).rejects.toThrow();
  });
});

describe("deleteOldPublicMenuVersionFromDbIfNecessary", () => {
  // En el caso de que se necesiten mocks se definen aquí
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  afterEach(() => {
    mockReset(prismaMock);
  });

  it("should delete old public menu version from db if necessary", async () => {
    // Arrange
    const testParams: DeleteOldPublicMenuVersionFromDbIfNecessaryParams = {
      publicVersionId: 1,
      prisma: prismaMock,
    };

    // Act
    await deleteOldPublicMenuVersionFromDbIfNeccessary(testParams);

    // Assert
    expect(prismaMock.menuVersion.delete).toHaveBeenCalledTimes(1);
    expect(prismaMock.menuVersion.delete).toHaveBeenCalledWith({
      where: {
        id: testParams.publicVersionId,
      },
    });
  });

  it("should not delete old public menu version from db if not necessary", async () => {
    // Arrange
    const testParams: DeleteOldPublicMenuVersionFromDbIfNecessaryParams = {
      publicVersionId: undefined,
      prisma: prismaMock,
    };

    // Act
    await deleteOldPublicMenuVersionFromDbIfNeccessary(testParams);

    // Assert
    expect(prismaMock.menuVersion.delete).not.toHaveBeenCalled();
  });

  it("should throw error if delete old public menu version from db fails", async () => {
    // Arrange
    const testParams: DeleteOldPublicMenuVersionFromDbIfNecessaryParams = {
      publicVersionId: 1,
      prisma: prismaMock,
    };

    // Act
    prismaMock.menuVersion.delete.mockRejectedValue(new Error());

    // Assert
    await expect(
      deleteOldPublicMenuVersionFromDbIfNeccessary(testParams),
    ).rejects.toThrow();
  });
});

describe("deletePublicMenuVersionImagesFromStorageIfNecessary", () => {
  const storageMock = mockDeep<TrpcContext["storage"]>();

  afterEach(() => {
    mockReset(storageMock);
  });

  it("should delete public menu version images from storage if necessary", async () => {
    // Arrange
    const lastVersion: MenuVersionQuery = {
      id: 1,
      isPublic: true,
      bgImageId: null,
      sections: [],
    };
    const publicVersion: MenuVersionQuery | undefined = {
      id: 1,
      isPublic: true,
      bgImageId: "1",
      sections: [],
    };
    const testParams: DeletePublicMenuVersionImagesFromStorageIfNecessaryParams =
      {
        storage: storageMock,
        lastVersion,
        publicVersion,
      };

    // Act
    await deletePublicMenuVersionImagesFromStorageIfNecessary(testParams);

    // Assert
    expect(storageMock.deleteImage).toHaveBeenCalledTimes(1);
    expect(storageMock.deleteImage).toHaveBeenCalledWith(
      publicVersion?.bgImageId,
    );
  });

  it("should not delete public menu version images from storage if not necessary", async () => {
    // Arrange
    const lastVersion: MenuVersionQuery = {
      id: 1,
      isPublic: true,
      bgImageId: null,
      sections: [],
    };
    const publicVersion: MenuVersionQuery | undefined = {
      id: 1,
      isPublic: true,
      bgImageId: null,
      sections: [],
    };
    const testParams: DeletePublicMenuVersionImagesFromStorageIfNecessaryParams =
      {
        storage: storageMock,
        lastVersion,
        publicVersion,
      };

    // Act
    await deletePublicMenuVersionImagesFromStorageIfNecessary(testParams);

    // Assert
    expect(storageMock.deleteImage).not.toHaveBeenCalled();
  });

  it("should throw error if delete public menu version images from storage fails", async () => {
    // Arrange
    const lastVersion: MenuVersionQuery = {
      id: 1,
      isPublic: true,
      bgImageId: null,
      sections: [],
    };
    const publicVersion: MenuVersionQuery | undefined = {
      id: 1,
      isPublic: true,
      bgImageId: "1",
      sections: [],
    };
    const testParams: DeletePublicMenuVersionImagesFromStorageIfNecessaryParams =
      {
        storage: storageMock,
        lastVersion,
        publicVersion,
      };

    // Act
    storageMock.deleteImage.mockRejectedValue(new Error());
    // Assert
    await expect(
      deletePublicMenuVersionImagesFromStorageIfNecessary(testParams),
    ).rejects.toThrow();
  });
});

import type { Menu } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

import type { TrpcContext } from "~/server/api/trpc";
import {
  deleteMenuFromDB,
  deleteMenuImagesFromStorage,
  findMenu,
  type DeleteMenuFromDBParams,
  type DeleteMenuImagesFromStorageParams,
  type FindMenuParams,
} from "./delete-menu.behaviour";
import type { MenuQuery } from "./delete-menu.types";

describe("findMenu", () => {
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  afterEach(() => {
    mockReset(prismaMock);
  });

  it("should return a menu if found", async () => {
    // Arrange
    const testParams: FindMenuParams = {
      menuId: "1",
      prisma: prismaMock,
    };

    const foundMenu: MenuQuery = {
      qrId: "1",
      versions: [
        {
          bgImageId: "1",
          sections: [
            {
              products: [
                {
                  imageId: "1",
                },
              ],
            },
          ],
        },
      ],
    };

    prismaMock.menu.findUnique.mockResolvedValue(foundMenu as unknown as Menu);

    // Act
    const result = await findMenu(testParams);

    // Assert
    expect(result).toEqual(foundMenu);
  });

  it("should throw if menu is not found", async () => {
    // Arrange
    const testParams: FindMenuParams = {
      menuId: "1",
      prisma: prismaMock,
    };

    // Act
    prismaMock.menu.findUnique.mockResolvedValue(null);

    // Assert
    await expect(findMenu(testParams)).rejects.toThrow();
  });
});

describe("deleteMenuImagesFromStorage", () => {
  const storageMock = mockDeep<TrpcContext["storage"]>();

  afterEach(() => {
    mockReset(storageMock);
  });

  it("should delete menu images from storage without error", async () => {
    // Arrange
    const testParams: DeleteMenuImagesFromStorageParams = {
      storage: storageMock,
      menu: {
        qrId: "1",
        versions: [
          {
            bgImageId: "2",
            sections: [
              {
                products: [
                  {
                    imageId: "3",
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    // Act
    await deleteMenuImagesFromStorage(testParams);

    // Assert
    expect(storageMock.deleteImage).toHaveBeenCalledTimes(3);
  });

  it("should throw if fails to delete menu images from storage", async () => {
    // Arrange
    const testParams: DeleteMenuImagesFromStorageParams = {
      storage: storageMock,
      menu: {
        qrId: "1",
        versions: [
          {
            bgImageId: "2",
            sections: [
              {
                products: [
                  {
                    imageId: "3",
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    // Act
    storageMock.deleteImage.mockRejectedValue(new Error());

    // Assert
    await expect(deleteMenuImagesFromStorage(testParams)).rejects.toThrow();
  });
});

describe("deleteMenuFromDB", () => {
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  afterEach(() => {
    mockReset(prismaMock);
  });

  it("should delete menu from database without error", async () => {
    // Arrange
    const testParams: DeleteMenuFromDBParams = {
      menuId: "1",
      prisma: prismaMock,
    };

    // Act
    await deleteMenuFromDB(testParams);

    // Assert
    expect(prismaMock.menu.delete).toHaveBeenCalledTimes(1);
  });

  it("should throw if fails to delete menu from database", async () => {
    // Arrange
    const testParams: DeleteMenuFromDBParams = {
      menuId: "1",
      prisma: prismaMock,
    };

    // Act
    prismaMock.menu.delete.mockRejectedValue(new Error());

    // Assert
    await expect(deleteMenuFromDB(testParams)).rejects.toThrow();
  });
});

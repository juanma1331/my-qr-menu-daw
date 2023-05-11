import type { MenuVersion } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

import type { TrpcContext } from "~/server/api/trpc";
import {
  findLastVersion,
  getProductsFromVersionSections,
  type FindLastVersionParams,
  type GetProductsFromVersionSectionsParams,
} from "./get-products-with-sections.behaviour";
import type {
  MenuVersionQuery,
  SectionQuery,
} from "./get-products-with-sections.types";

describe("findLastVersion", () => {
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  afterEach(() => {
    mockReset(prismaMock);
  });

  it("should return the last version of the menu", async () => {
    // Arrange
    const menuId = "some-menu-id";
    const testParams: FindLastVersionParams = { prisma: prismaMock, menuId };
    const testMenuVerion: MenuVersionQuery = {
      isPublic: true,
      sections: [
        {
          products: [
            {
              id: 1,
              name: "some-product-name",
              imageId: "some-product-image-id",
              price: 1,
              section: {
                id: 1,
                name: "some-section-name",
              },
            },
          ],
        },
      ],
    };

    prismaMock.menuVersion.findFirst.mockResolvedValueOnce(
      testMenuVerion as unknown as MenuVersion,
    );

    // Act
    const result = await findLastVersion(testParams);

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
          select: {
            products: {
              select: {
                id: true,
                name: true,
                price: true,
                imageId: true,
                section: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    expect(result).toEqual(testMenuVerion);
  });

  it("should throw an error if no version is found", async () => {
    // Arrange
    const menuId = "some-menu-id";
    const testParams: FindLastVersionParams = { prisma: prismaMock, menuId };

    // Act
    prismaMock.menuVersion.findFirst.mockResolvedValueOnce(null);

    // Assert
    await expect(() => findLastVersion(testParams)).rejects.toThrow();
  });
});

describe("getProductsFromVersionSections", () => {
  it("should return an array of products from the sections", () => {
    // Arrange
    const sections: SectionQuery[] = [
      {
        products: [
          {
            id: 1,
            name: "some-product-name",
            imageId: "some-product-image-id",
            price: 1,
            section: {
              id: 1,
              name: "some-section-name",
            },
          },
        ],
      },
    ];
    const testParams: GetProductsFromVersionSectionsParams = { sections };

    // Act
    const result = getProductsFromVersionSections(testParams);

    // Assert
    expect(result).toEqual([
      {
        id: 1,
        name: "some-product-name",
        imageId: "some-product-image-id",
        price: 1,
        section: {
          id: 1,
          name: "some-section-name",
        },
      },
    ]);
  });

  it("should return an empty array if no products are present in the sections", () => {
    // Arrange
    const sections: SectionQuery[] = [
      {
        products: [],
      },
    ];
    const testParams: GetProductsFromVersionSectionsParams = { sections };

    // Act

    const result = getProductsFromVersionSections(testParams);

    // Assert
    expect(result).toEqual([]);
  });
});

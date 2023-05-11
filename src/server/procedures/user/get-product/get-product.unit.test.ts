import { afterEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

import type { TrpcContext } from "~/server/api/trpc";
import { findProduct, type FindProductParams } from "./get-product.behaviour";
import type { ProductQuery } from "./get-product.types";

describe("findProduct", () => {
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  afterEach(() => {
    mockReset(prismaMock);
  });

  it("should return a product when found", async () => {
    // Arrange
    const id = 1;
    const testParams: FindProductParams = { id, prisma: prismaMock };
    const foundProduct: ProductQuery = {
      id: 1,
      name: "name",
      description: "description",
      price: 1,
      imageId: "1",
      sectionId: 1,
    };

    prismaMock.product.findUnique.mockResolvedValueOnce(foundProduct);

    // Act
    const result = await findProduct(testParams);

    // Assert
    expect(prismaMock.product.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.product.findUnique).toHaveBeenCalledWith({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageId: true,
        sectionId: true,
      },
    });
    expect(result).toEqual(foundProduct);
  });

  it("should throw when product is not found", async () => {
    // Arrange
    const id = 1;
    const testParams: FindProductParams = { id, prisma: prismaMock };

    // Act
    prismaMock.product.findUnique.mockResolvedValueOnce(null);

    // Assert
    await expect(findProduct(testParams)).rejects.toThrow();
  });
});

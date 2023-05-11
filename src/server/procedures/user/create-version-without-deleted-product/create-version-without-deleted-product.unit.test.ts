import { afterEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

import type { TrpcContext } from "~/server/api/trpc";
import type { SectionQuery } from "../shared/behaviours/get-latest-version/get-latest-version.behaviour";
import {
  createNewVersion,
  deleteProductImageFromStorage,
  prepareVersionSectionsForCreation,
  removeProductFromSection,
  type CreateNewVersionParams,
  type DeleteProductImageFromStorageParams,
} from "./create-version-without-deleted-product.behaviour";
import type {
  NewVersionData,
  PreparedSection,
} from "./create-version-without-deleted-product.types";

describe("removeProductFromSection", () => {
  it("should remove the product from the section", () => {
    // Arrange
    const sections: SectionQuery[] = [
      {
        id: 1,
        menuVersionId: 1,
        name: "Section 1",
        position: 1,
        products: [
          {
            id: 1,
            name: "Product 1",
            description: "Product 1 description",
            imageId: "1",
            price: 100,
            sectionId: 1,
          },
        ],
      },
    ];
    const productId = 1;

    // Act
    const result = removeProductFromSection({ sections, productId });

    // Assert
    const section = sections[0];
    expect(result).toEqual([
      {
        id: section?.id,
        menuVersionId: section?.menuVersionId,
        name: section?.name,
        position: section?.position,
        products: [],
      },
    ]);
  });

  it("should throw an error if product section is not found", () => {
    // Arrange
    const sections: SectionQuery[] = [
      {
        id: 1,
        menuVersionId: 1,
        name: "Section 1",
        position: 1,
        products: [
          {
            id: 2,
            name: "Product 1",
            description: "Product 1 description",
            imageId: "1",
            price: 100,
            sectionId: 1,
          },
        ],
      },
    ];
    const productId = 1;

    // Act
    // Assert
    expect(() =>
      removeProductFromSection({ sections, productId }),
    ).toThrowError();
  });
});

describe("prepareVersionSectionsForCreation", () => {
  it("should return prepared sections for creation", () => {
    // Arrange
    const sections: SectionQuery[] = [
      {
        id: 1,
        menuVersionId: 1,
        name: "Section 1",
        position: 1,
        products: [
          {
            id: 1,
            name: "Product 1",
            description: "Product 1 description",
            imageId: "1",
            price: 100,
            sectionId: 1,
          },
        ],
      },
    ];

    // Act
    const result = prepareVersionSectionsForCreation({ sections });

    // Assert
    const section = sections[0];
    const product = section?.products[0];
    expect(result).toEqual([
      {
        name: section?.name,
        position: section?.position,
        products: {
          create: [
            {
              name: product?.name,
              description: product?.description,
              imageId: product?.imageId,
              price: product?.price,
            },
          ],
        },
      },
    ]);
  });
});

describe("createNewVersion", () => {
  // En el caso de que se necesiten mocks se definen aquí
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  afterEach(() => {
    mockReset(prismaMock);
  });

  it("should create a new version", async () => {
    // Arrange
    const menuId = "1";
    const sections: PreparedSection[] = [
      {
        name: "Section 1",
        position: 1,
        products: {
          create: [
            {
              name: "Product 1",
              description: "Product 1 description",
              imageId: "1",
              price: 100,
            },
          ],
        },
      },
    ];
    const newVersionData: NewVersionData = {
      bgImageId: "1",
      subtitle: "Subtitle",
      title: "Title",
    };

    const testParams: CreateNewVersionParams = {
      menuId,
      prisma: prismaMock,
      sections,
      newVersionData,
    };

    // Act
    await createNewVersion(testParams);

    // Assert
    expect(prismaMock.menuVersion.create).toBeCalledTimes(1);
    expect(prismaMock.menuVersion.create).toBeCalledWith({
      data: {
        ...newVersionData,
        menuId,
        sections: {
          create: sections,
        },
      },
    });
  });

  it("should throw an error if creating new version fails", async () => {
    // Arrange
    const menuId = "1";
    const sections: PreparedSection[] = [
      {
        name: "Section 1",
        position: 1,
        products: {
          create: [
            {
              name: "Product 1",
              description: "Product 1 description",
              imageId: "1",
              price: 100,
            },
          ],
        },
      },
    ];
    const newVersionData: NewVersionData = {
      bgImageId: "1",
      subtitle: "Subtitle",
      title: "Title",
    };

    const testParams: CreateNewVersionParams = {
      menuId,
      prisma: prismaMock,
      sections,
      newVersionData,
    };

    // Act
    prismaMock.menuVersion.create.mockRejectedValueOnce(
      new Error("Error creating new version"),
    );

    // Assert
    await expect(createNewVersion(testParams)).rejects.toThrowError();
  });
});

describe("deleteProductImageFromStorage", () => {
  // En el caso de que se necesiten mocks se definen aquí
  const storageMock = mockDeep<TrpcContext["storage"]>();

  afterEach(() => {
    mockReset(storageMock);
  });

  it("should not delete product image if last version is public", async () => {
    // Arrange
    const sections: SectionQuery[] = [
      {
        id: 1,
        menuVersionId: 1,
        name: "Section 1",
        position: 1,
        products: [
          {
            id: 1,
            name: "Product 1",
            description: "Product 1 description",
            imageId: "1",
            price: 100,
            sectionId: 1,
          },
        ],
      },
    ];
    const productId = 1;
    const isLastVersionPublic = true;

    const testParams: DeleteProductImageFromStorageParams = {
      isLastVersionPublic,
      sections,
      productId,
      storage: storageMock,
    };

    // Act
    await deleteProductImageFromStorage(testParams);

    // Assert
    expect(storageMock.deleteImage).not.toBeCalled();
  });

  it("should delete product image from storage", async () => {
    // Arrange
    const productId = 1;
    const sections: SectionQuery[] = [
      {
        id: 1,
        menuVersionId: 1,
        name: "Section 1",
        position: 1,
        products: [
          {
            id: productId,
            name: "Product 1",
            description: "Product 1 description",
            imageId: "1",
            price: 100,
            sectionId: 1,
          },
        ],
      },
    ];
    const isLastVersionPublic = false;

    const testParams: DeleteProductImageFromStorageParams = {
      isLastVersionPublic,
      sections,
      productId,
      storage: storageMock,
    };

    // Act
    await deleteProductImageFromStorage(testParams);

    // Assert
    const product = sections[0]?.products[0];
    expect(storageMock.deleteImage).toBeCalledTimes(1);
    expect(storageMock.deleteImage).toBeCalledWith(product?.imageId);
  });

  it("should throw an error if product section is not found", async () => {
    // Arrange
    const productId = 1;
    const sections: SectionQuery[] = [
      {
        id: 1,
        menuVersionId: 1,
        name: "Section 1",
        position: 1,
        products: [
          {
            id: 2,
            name: "Product 1",
            description: "Product 1 description",
            imageId: "1",
            price: 100,
            sectionId: 1,
          },
        ],
      },
    ];
    const isLastVersionPublic = false;

    const testParams: DeleteProductImageFromStorageParams = {
      isLastVersionPublic,
      sections,
      productId,
      storage: storageMock,
    };

    // Act
    // Assert
    await expect(
      deleteProductImageFromStorage(testParams),
    ).rejects.toThrowError();
  });

  it("should throw an error if product image is not found", async () => {
    // Arrange
    const productId = 1;
    const sections: SectionQuery[] = [
      {
        id: 1,
        menuVersionId: 1,
        name: "Section 1",
        position: 1,
        products: [
          {
            id: 2,
            name: "Product 1",
            description: "Product 1 description",
            imageId: "1",
            price: 100,
            sectionId: 1,
          },
        ],
      },
    ];
    const isLastVersionPublic = false;

    const testParams: DeleteProductImageFromStorageParams = {
      isLastVersionPublic,
      sections,
      productId,
      storage: storageMock,
    };

    // Act
    // Assert
    await expect(
      deleteProductImageFromStorage(testParams),
    ).rejects.toThrowError();
  });

  it("should throw an error if deleting product image fails", async () => {
    // Arrange
    const productId = 1;
    const sections: SectionQuery[] = [
      {
        id: 1,
        menuVersionId: 1,
        name: "Section 1",
        position: 1,
        products: [
          {
            id: productId,
            name: "Product 1",
            description: "Product 1 description",
            imageId: "1",
            price: 100,
            sectionId: 1,
          },
        ],
      },
    ];
    const isLastVersionPublic = false;

    const testParams: DeleteProductImageFromStorageParams = {
      isLastVersionPublic,
      sections,
      productId,
      storage: storageMock,
    };

    // Act
    storageMock.deleteImage.mockRejectedValueOnce(
      new Error("Error deleting product image"),
    );

    // Assert
    await expect(
      deleteProductImageFromStorage(testParams),
    ).rejects.toThrowError();
  });
});

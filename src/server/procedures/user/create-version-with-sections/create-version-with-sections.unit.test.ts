import type { MenuVersion } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

import type { RouterInputs } from "~/utils/api";
import type { TrpcContext } from "~/server/api/trpc";
import type {
  MenuVersionQuery,
  ProductQuery,
  SectionQuery,
} from "../shared/behaviours/get-latest-version/get-latest-version.behaviour";
import {
  createNewVersion,
  deleteProductImagesFromStorageIfNeeded,
  getProductsFromVersionSections,
  prepareProductForCreation,
  prepareSectionsForCreation,
  type CreateNewVersionParams,
  type DeleteProductImagesFromStorageIfNeededParams,
} from "./create-version-with-sections.behaviour";
import type {
  CreatedMenuVersion,
  MenuVersionForCreation,
} from "./create-version-with-sections.types";

describe("getProductsFromVersionSections", () => {
  it("should return products from version sections", () => {
    // Arrange
    const sections: SectionQuery[] = [
      {
        name: "Section 1",
        position: 1,
        id: 1,
        menuVersionId: 1,
        products: [
          {
            name: "Product 1",
            imageId: "imageId1",
            description: "Description 1",
            price: 1,
            id: 1,
            sectionId: 1,
          },
        ],
      },
    ];

    // Act
    const result = getProductsFromVersionSections(sections);

    // Assert
    const product = sections[0]?.products[0];
    expect(result).toEqual([
      {
        name: product?.name,
        imageId: product?.imageId,
        description: product?.description,
        price: product?.price,
        id: product?.id,
        sectionId: product?.sectionId,
      },
    ]);
  });
});

describe("prepareProductForCreation", () => {
  it("should return a product object with the required properties", () => {
    // Arrange
    const product: ProductQuery = {
      id: 1,
      name: "name",
      description: "description",
      price: 1,
      imageId: "imageId",
      sectionId: 1,
    };

    // Act
    const result = prepareProductForCreation(product);

    // Assert
    expect(result).toEqual({
      name: product.name,
      description: product.description,
      price: product.price,
      imageId: product.imageId,
    });
  });
});

describe("prepareSectionsForCreation", () => {
  it("should return the correct sections structure", () => {
    // Arrange
    const sections: RouterInputs["menus"]["createVersionWithSections"]["sections"] =
      [
        {
          id: 1,
          name: "Section 1",
        },
      ];
    const products: ProductQuery[] = [
      {
        id: 1,
        sectionId: 1,
        name: "Product 1",
        description: "Description 1",
        price: 1,
        imageId: "imageId1",
      },
    ];
    // Act

    const result = prepareSectionsForCreation({ sections, products });

    // Assert
    const section = sections[0];
    const product = products[0];
    expect(result).toEqual({
      create: [
        {
          name: section?.name,
          position: 1,
          products: {
            create: [
              {
                name: product?.name,
                imageId: product?.imageId,
                description: product?.description,
                price: product?.price,
              },
            ],
          },
        },
      ],
    });
  });
});

describe("createNewVersion", () => {
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  afterEach(() => {
    mockReset(prismaMock);
  });

  it("should create a new version and return the created version", async () => {
    // Arrange
    const version: MenuVersionForCreation = {
      bgImageId: "bg-image-id",
      subtitle: "test-subtitle",
      title: "test-title",
    };
    const sections: ReturnType<typeof prepareSectionsForCreation> = {
      create: [
        {
          name: "test-name",
          position: 1,
          products: {
            create: [
              {
                name: "test-name",
                description: "test-description",
                price: 12,
                imageId: "image-id",
              },
            ],
          },
        },
      ],
    };
    const params: CreateNewVersionParams = {
      menuId: "menu-id",
      prisma: prismaMock,
      version,
      sections,
    };

    const createdMenuVersion: CreatedMenuVersion = {
      bgImageId: version.bgImageId,
      isPublic: false,
      sections: [
        {
          id: 1,
          name: "test-name",
          products: [
            {
              imageId: "test-image-id",
            },
          ],
        },
      ],
    };

    prismaMock.menuVersion.create.mockResolvedValue(
      createdMenuVersion as unknown as MenuVersion,
    );

    // Act
    const result = await createNewVersion(params);

    // Assert
    expect(result).toEqual(createdMenuVersion);
  });

  it("should throw an error if there is a problem creating the new version", async () => {
    // Arrange
    const version: MenuVersionForCreation = {
      bgImageId: "bg-image-id",
      subtitle: "test-subtitle",
      title: "test-title",
    };
    const sections: ReturnType<typeof prepareSectionsForCreation> = {
      create: [
        {
          name: "test-name",
          position: 1,
          products: {
            create: [
              {
                name: "test-name",
                description: "test-description",
                price: 12,
                imageId: "image-id",
              },
            ],
          },
        },
      ],
    };
    const params: CreateNewVersionParams = {
      menuId: "menu-id",
      prisma: prismaMock,
      version,
      sections,
    };

    // Act
    prismaMock.menuVersion.create.mockRejectedValue(new Error("test-error"));

    // Assert
    await expect(createNewVersion(params)).rejects.toThrowError();
  });
});

describe("deleteProductImagesFromStorageIfNeeded", () => {
  const storageMock = mockDeep<TrpcContext["storage"]>();

  afterEach(() => {
    mockReset(storageMock);
  });

  it("should delete the images that are no longer needed", async () => {
    // Arrange
    const lastVersion: MenuVersionQuery = {
      id: 1,
      bgImageId: "bg-image-id",
      createdAt: new Date(),
      menuId: "menu-id",
      isPublic: false,
      title: "test-title",
      subtitle: "test-subtitle",
      sections: [
        {
          id: 1,
          name: "test-name",
          position: 1,
          menuVersionId: 1,
          products: [
            {
              id: 1,
              imageId: "image-id",
              name: "test-name",
              description: "test-description",
              price: 12,
              sectionId: 1,
            },
          ],
        },
      ],
    };

    const createdVersion: CreatedMenuVersion = {
      bgImageId: null,
      isPublic: false,
      sections: [
        {
          id: 1,
          name: "test-name",
          products: [
            {
              imageId: "image-id",
            },
          ],
        },
      ],
    };
    const params: DeleteProductImagesFromStorageIfNeededParams = {
      storage: storageMock,
      lastVersion,
      createdVersion,
    };
    // Act
    await deleteProductImagesFromStorageIfNeeded(params);

    // Assert
    expect(storageMock.deleteImage).toBeCalledTimes(1);
    expect(storageMock.deleteImage).toBeCalledWith(lastVersion.bgImageId);
  });

  it("should throw an error if there is a problem deleting images", async () => {
    // Arrange
    const lastVersion: MenuVersionQuery = {
      id: 1,
      bgImageId: "bg-image-id",
      createdAt: new Date(),
      menuId: "menu-id",
      isPublic: false,
      title: "test-title",
      subtitle: "test-subtitle",
      sections: [
        {
          id: 1,
          name: "test-name",
          position: 1,
          menuVersionId: 1,
          products: [
            {
              id: 1,
              imageId: "image-id",
              name: "test-name",
              description: "test-description",
              price: 12,
              sectionId: 1,
            },
          ],
        },
      ],
    };

    const createdVersion: CreatedMenuVersion = {
      bgImageId: null,
      isPublic: false,
      sections: [
        {
          id: 1,
          name: "test-name",
          products: [
            {
              imageId: "image-id",
            },
          ],
        },
      ],
    };
    const params: DeleteProductImagesFromStorageIfNeededParams = {
      storage: storageMock,
      lastVersion,
      createdVersion,
    };

    // Act
    storageMock.deleteImage.mockRejectedValue(new Error("test-error"));

    // Assert
    await expect(
      deleteProductImagesFromStorageIfNeeded(params),
    ).rejects.toThrowError();
  });
});

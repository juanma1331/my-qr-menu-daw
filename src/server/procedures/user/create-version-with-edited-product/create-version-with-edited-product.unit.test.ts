import { afterEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

import type { TrpcContext } from "~/server/api/trpc";
import {
  createNewVersion,
  handleProductImage,
  prepareProductForCreation,
  replaceProductInSection,
  type CreateNewVersionParams,
  type HandleProductImageParams,
  type PrepareProductForCreationParams,
  type ReplaceProductInSectionParams,
} from "./create-version-with-edited-product.behaviour";

describe("handleProductImage", () => {
  const storageMock = mockDeep<TrpcContext["storage"]>();

  afterEach(() => {
    mockReset(storageMock);
  });

  it("should delete old image and upload new image when user edited the image", async () => {
    // Arrange
    const testParams: HandleProductImageParams = {
      storage: storageMock,
      currentImageId: "current-image-id",
      newImage: {
        data: "new-image-data",
        name: "new-image-name",
        size: 1,
        type: "image/png",
      },
    };

    // Act
    await handleProductImage(testParams);

    // Assert
    expect(storageMock.upload).toHaveBeenCalledTimes(1);
    expect(storageMock.upload).toHaveBeenCalledWith(testParams.newImage?.data);
    expect(storageMock.deleteImage).toHaveBeenCalledTimes(1);
    expect(storageMock.deleteImage).toHaveBeenCalledWith(
      testParams.currentImageId,
    );
  });

  it("should return currentImageId when user has not edited the image", async () => {
    // Arrange
    const testParams: HandleProductImageParams = {
      storage: storageMock,
      currentImageId: "current-image-id",
      newImage: null,
    };

    // Act
    const result = await handleProductImage(testParams);

    // Assert
    expect(result).toBe(testParams.currentImageId);
  });

  it("should throw error when image processing fails", async () => {
    // Arrange
    const testParams: HandleProductImageParams = {
      storage: storageMock,
      currentImageId: "current-image-id",
      newImage: {
        data: "new-image-data",
        name: "new-image-name",
        size: 1,
        type: "image/png",
      },
    };

    // Act
    storageMock.upload.mockRejectedValueOnce(new Error("error"));

    // Assert
    await expect(handleProductImage(testParams)).rejects.toThrow();
  });
});

describe("prepareProductForCreation", () => {
  it("should return product to be updated object with imageId", () => {
    // Arrange
    const testParams: PrepareProductForCreationParams = {
      imageId: "image-id",
      newProduct: {
        currentImageId: "current-image-id",
        id: 1,
        name: "name",
        description: "description",
        price: 1,
        image: {
          name: "name",
          size: 1,
          type: "image/png",
          data: "data",
        },
      },
    };

    // Act
    const result = prepareProductForCreation(testParams);

    // Assert
    expect(result).toEqual({
      id: testParams.newProduct.id,
      imageId: testParams.imageId,
      name: testParams.newProduct.name,
      description: testParams.newProduct.description,
      price: testParams.newProduct.price,
    });
  });
});

describe("replaceProductInSection", () => {
  it("should return prepared sections with updated product", () => {
    // Arrange
    const testParams: ReplaceProductInSectionParams = {
      sections: [
        {
          id: 1,
          name: "name",
          position: 1,
          menuVersionId: 1,
          products: [
            {
              id: 1,
              name: "name",
              description: "description",
              price: 1,
              imageId: "image-id",
              sectionId: 1,
            },
          ],
        },
      ],
      newProduct: {
        id: 1,
        name: "name",
        description: "description",
        price: 1,
        imageId: "image-id",
      },
    };

    // Act
    const result = replaceProductInSection(testParams);

    // Assert
    const testSections = testParams.sections[0];
    expect(result).toEqual([
      {
        name: testSections?.name,
        position: testSections?.position,
        products: {
          create: [
            {
              name: testParams.newProduct.name,
              description: testParams.newProduct.description,
              price: testParams.newProduct.price,
              imageId: testParams.newProduct.imageId,
            },
          ],
        },
      },
    ]);
  });
});

describe("createNewVersion", () => {
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  afterEach(() => {
    mockReset(prismaMock);
  });

  it("should create a new menu version with sections", async () => {
    // Arrange
    const testParams: CreateNewVersionParams = {
      prisma: prismaMock,
      menuId: "menu-id",
      sections: [
        {
          name: "name",
          position: 1,
          products: {
            create: [
              {
                name: "name",
                description: "description",
                price: 1,
                imageId: "image-id",
              },
            ],
          },
        },
      ],
      newVersionData: {
        title: "title",
        subtitle: "subtitle",
        bgImageId: "bg-image-id",
      },
    };

    // Act
    await createNewVersion(testParams);

    // Assert
    expect(prismaMock.menuVersion.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.menuVersion.create).toHaveBeenCalledWith({
      data: {
        ...testParams.newVersionData,
        menuId: testParams.menuId,
        sections: {
          create: testParams.sections,
        },
      },
    });
  });

  it("should throw error when creating new version fails", async () => {
    // Arrange
    const testParams: CreateNewVersionParams = {
      prisma: prismaMock,
      menuId: "menu-id",
      newVersionData: {
        bgImageId: "bg-image-id",
        title: "title",
        subtitle: "subtitle",
      },
      sections: [
        {
          name: "name",
          position: 1,
          products: {
            create: [
              {
                name: "name",
                description: "description",
                price: 1,
                imageId: "image-id",
              },
            ],
          },
        },
      ],
    };

    // Act
    prismaMock.menuVersion.create.mockRejectedValueOnce(new Error("error"));

    // Assert
    await expect(createNewVersion(testParams)).rejects.toThrow();
  });
});

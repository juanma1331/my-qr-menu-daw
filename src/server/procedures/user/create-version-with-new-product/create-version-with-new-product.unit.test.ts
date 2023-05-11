import { afterEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

import type { RouterInputs } from "~/utils/api";
import type { TrpcContext } from "~/server/api/trpc";
import type { SectionQuery } from "../shared/behaviours/get-latest-version/get-latest-version.behaviour";
import {
  addNewProductToSection,
  createNewVersion,
  prepareProductForCreation,
  prepareVersionSectionsForCreation,
  type AddNewProductToSectionParams,
  type CreateNewVersionParams,
  type PrepareProductForCreationParams,
  type PrepareVersionSectionsForCreationParams,
} from "./create-version-with-new-product.behaviour";
import type {
  NewVersionData,
  PreparedProduct,
  PreparedSection,
} from "./create-version-with-new-product.types";

describe("prepareProductForCreation", () => {
  const storageMock = mockDeep<TrpcContext["storage"]>();

  afterEach(() => {
    mockReset(storageMock);
  });

  it("should return a prepared product with a valid imageId", async () => {
    // Arrange
    const testImageId = "test-image-id";
    const newProduct: RouterInputs["menus"]["createVersionWithNewProduct"]["product"] =
      {
        description: "description",
        name: "name",
        price: 1,
        image: {
          data: "data",
          name: "name",
          size: 1,
          type: "image/png",
        },
      };
    const testParams: PrepareProductForCreationParams = {
      newProduct,
      storage: storageMock,
    };

    storageMock.upload.mockResolvedValue(testImageId);

    // Act
    const result = await prepareProductForCreation(testParams);

    // Assert
    expect(result).toEqual({
      imageId: testImageId,
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
    });
  });

  it("should throw an error if image upload fails", async () => {
    // Arrange
    const newProduct: RouterInputs["menus"]["createVersionWithNewProduct"]["product"] =
      {
        description: "description",
        name: "name",
        price: 1,
        image: {
          data: "data",
          name: "name",
          size: 1,
          type: "image/png",
        },
      };
    const testParams: PrepareProductForCreationParams = {
      newProduct,
      storage: storageMock,
    };

    // Act
    storageMock.upload.mockRejectedValueOnce(new Error("error"));

    // Assert
    await expect(prepareProductForCreation(testParams)).rejects.toThrow();
  });
});

describe("prepareVersionSectionsForCreation", () => {
  it("should return preparedSections and productSectionPosition", () => {
    // Arrange
    const sections: SectionQuery[] = [
      {
        id: 1,
        name: "name",
        menuVersionId: 1,
        position: 1,
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
    ];
    const productSectionId = 1;
    const testParams: PrepareVersionSectionsForCreationParams = {
      sections,
      productSectionId,
    };

    // Act
    const result = prepareVersionSectionsForCreation(testParams);

    // Assert
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const section = sections[0]!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const product = section.products[0]!;
    expect(result).toEqual({
      productSectionPosition: section.position,
      preparedSections: [
        {
          name: section.name,
          position: section.position,
          products: {
            create: [
              {
                name: product.name,
                description: product.description,
                price: product.price,
                imageId: product.imageId,
              },
            ],
          },
        },
      ],
    });
  });

  it("should throw an error if the section with provided id does not exist", () => {
    // Arrange
    const sections: SectionQuery[] = [
      {
        id: 1,
        name: "name",
        menuVersionId: 1,
        position: 1,
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
    ];
    const productSectionId = 2;
    const testParams: PrepareVersionSectionsForCreationParams = {
      sections,
      productSectionId,
    };

    // Act
    // Assert
    expect(() => prepareVersionSectionsForCreation(testParams)).toThrow();
  });
});

describe("addNewProductToSection", () => {
  it("should add the new product to the specified section", () => {
    // Arrange
    const sections: PreparedSection[] = [
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
    ];
    const newProduct: PreparedProduct = {
      name: "name",
      description: "description",
      price: 1,
      imageId: "image-id",
    };

    const productSectionPosition = 1;
    const testParams: AddNewProductToSectionParams = {
      sections,
      newProduct,
      productSectionPosition,
    };

    // Act
    const result = addNewProductToSection(testParams);

    // Assert
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const section = sections[0]!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const sectionProduct = section.products.create[0]!;
    expect(result).toEqual([
      {
        name: section.name,
        position: section.position,
        products: {
          create: [
            {
              name: sectionProduct.name,
              description: sectionProduct.description,
              price: sectionProduct.price,
              imageId: sectionProduct.imageId,
            },
            {
              name: newProduct.name,
              description: newProduct.description,
              price: newProduct.price,
              imageId: newProduct.imageId,
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

  it("should create a new version successfully", async () => {
    // Arrange
    const menuId = "menu-id";
    const sections: PreparedSection[] = [
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
    ];
    const newVersionData: NewVersionData = {
      title: "title",
      subtitle: "subtitle",
      bgImageId: "bg-image-id",
    };
    const testParams: CreateNewVersionParams = {
      prisma: prismaMock,
      menuId,
      sections,
      newVersionData,
    };

    // Act
    await createNewVersion(testParams);

    // Assert
    expect(prismaMock.menuVersion.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.menuVersion.create).toHaveBeenCalledWith({
      data: {
        ...newVersionData,
        menuId,
        sections: {
          create: sections,
        },
      },
    });
  });

  it("should throw an error if the creation fails", async () => {
    // Arrange
    const menuId = "menu-id";
    const sections: PreparedSection[] = [
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
    ];
    const newVersionData: NewVersionData = {
      title: "title",
      subtitle: "subtitle",
      bgImageId: "bg-image-id",
    };
    const testParams: CreateNewVersionParams = {
      prisma: prismaMock,
      menuId,
      sections,
      newVersionData,
    };

    // Act
    prismaMock.menuVersion.create.mockRejectedValueOnce(new Error("error"));

    // Assert
    await expect(createNewVersion(testParams)).rejects.toThrow();
  });
});

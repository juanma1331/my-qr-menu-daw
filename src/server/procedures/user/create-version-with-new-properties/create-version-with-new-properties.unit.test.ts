import type { MenuVersion } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

import type { RouterInputs } from "~/utils/api";
import type { TrpcContext } from "~/server/api/trpc";
import {
  createNewVersion,
  createNewVersionData,
  deleteOldVersionBgImageFromStorageIfNeeded,
  type CreateNewVersionDataParams,
  type CreateNewVersionParams,
  type DeleteOldVersionBgImageFromStorageIfNeeded,
} from "./create-version-with-new-properties.behaviour";
import type {
  CreatedMenuVersion,
  MenuVersionQuery,
} from "./create-version-with-new-properties.types";

describe("createNewVersionData", () => {
  const storageMock = mockDeep<TrpcContext["storage"]>();

  afterEach(() => {
    mockReset(storageMock);
  });

  it("should call image storage service once with a new image", async () => {
    // Arrange
    const lastVersion: MenuVersionQuery = {
      id: 1,
      title: "test",
      subtitle: "subtitle-test",
      isPublic: true,
      bgImageId: null,
      sections: [
        {
          name: "section-1",
          position: 1,
          products: [
            {
              name: "product-1",
              description: "description-1",
              price: 1,
              imageId: "1",
            },
            {
              name: "product-2",
              description: "description-2",
              price: 2,
              imageId: "2",
            },
          ],
        },
      ],
    };
    const input: RouterInputs["menus"]["createVersionWithNewProperties"] = {
      menuId: "1",
      properties: {
        title: "test",
        subtitle: "subtitle-test",
        image: {
          data: "test-data",
          name: "test-name",
          size: 1,
          type: "image/png",
        },
        deleteImage: false,
      },
    };
    const testParams: CreateNewVersionDataParams = {
      lastVersion,
      input,
      storage: storageMock,
    };

    const testImageId = "test-id";

    storageMock.upload.mockResolvedValueOnce(testImageId);

    // Act
    const data = await createNewVersionData(testParams);

    // Assert
    expect(storageMock.upload).toHaveBeenCalledTimes(1);
    expect(storageMock.upload).toHaveBeenCalledWith(
      input.properties.image?.data,
    );
    expect(data.bgImageId).toBe(testImageId);
  });

  it("should throw if image upload service fails", async () => {
    // Arrange
    const lastVersion: MenuVersionQuery = {
      id: 1,
      title: "test",
      subtitle: "subtitle-test",
      isPublic: true,
      bgImageId: null,
      sections: [
        {
          name: "section-1",
          position: 1,
          products: [
            {
              name: "product-1",
              description: "description-1",
              price: 1,
              imageId: "1",
            },
            {
              name: "product-2",
              description: "description-2",
              price: 2,
              imageId: "2",
            },
          ],
        },
      ],
    };
    const input: RouterInputs["menus"]["createVersionWithNewProperties"] = {
      menuId: "1",
      properties: {
        title: "test",
        subtitle: "subtitle-test",
        image: {
          data: "test-data",
          name: "test-name",
          size: 1,
          type: "image/png",
        },
        deleteImage: false,
      },
    };
    const testParams: CreateNewVersionDataParams = {
      lastVersion,
      input,
      storage: storageMock,
    };

    storageMock.upload.mockRejectedValueOnce(new Error());

    // Act
    await expect(createNewVersionData(testParams)).rejects.toThrow();
  });

  it("when input deleteImage is true should return new version data and image id as null", async () => {
    // Arrange
    const lastVersion: MenuVersionQuery = {
      id: 1,
      title: "test",
      subtitle: "subtitle-test",
      isPublic: true,
      bgImageId: null,
      sections: [
        {
          name: "section-1",
          position: 1,
          products: [
            {
              name: "product-1",
              description: "description-1",
              price: 1,
              imageId: "1",
            },
            {
              name: "product-2",
              description: "description-2",
              price: 2,
              imageId: "2",
            },
          ],
        },
      ],
    };
    const input: RouterInputs["menus"]["createVersionWithNewProperties"] = {
      menuId: "1",
      properties: {
        title: "test",
        subtitle: "subtitle-test",
        image: {
          data: "test-data",
          name: "test-name",
          size: 1,
          type: "image/png",
        },
        deleteImage: true,
      },
    };
    const testParams: CreateNewVersionDataParams = {
      lastVersion,
      input,
      storage: storageMock,
    };

    // Act
    const data = await createNewVersionData(testParams);

    // Assert
    expect(storageMock.upload).toHaveBeenCalledTimes(0);
    expect(data.bgImageId).toBe(null);
    expect(data.title).toBe(input.properties.title);
    expect(data.subtitle).toBe(input.properties.subtitle);
    expect(Array.isArray(data.sections.create)).toBe(true);
  });

  it("when new image should return new version data and image id", async () => {
    // Arrange
    const lastVersion: MenuVersionQuery = {
      id: 1,
      title: "test",
      subtitle: "subtitle-test",
      isPublic: true,
      bgImageId: null,
      sections: [
        {
          name: "section-1",
          position: 1,
          products: [
            {
              name: "product-1",
              description: "description-1",
              price: 1,
              imageId: "1",
            },
            {
              name: "product-2",
              description: "description-2",
              price: 2,
              imageId: "2",
            },
          ],
        },
      ],
    };
    const input: RouterInputs["menus"]["createVersionWithNewProperties"] = {
      menuId: "1",
      properties: {
        title: "test",
        subtitle: "subtitle-test",
        image: {
          data: "test-data",
          name: "test-name",
          size: 1,
          type: "image/png",
        },
        deleteImage: false,
      },
    };
    const testParams: CreateNewVersionDataParams = {
      lastVersion,
      input,
      storage: storageMock,
    };

    const testImageId = "test-id";

    storageMock.upload.mockResolvedValueOnce(testImageId);

    // Act
    const data = await createNewVersionData(testParams);

    // Assert
    expect(storageMock.upload).toHaveBeenCalledTimes(1);
    expect(data.bgImageId).toBe(testImageId);
    expect(data.title).toBe(input.properties.title);
    expect(data.subtitle).toBe(input.properties.subtitle);
    expect(Array.isArray(data.sections.create)).toBe(true);
  });

  it("when new no new image and no deleteImage should return new version data and last version image id", async () => {
    // Arrange
    const lastVersion: MenuVersionQuery = {
      id: 1,
      title: "test",
      subtitle: "subtitle-test",
      isPublic: true,
      bgImageId: "last-version-image-id",
      sections: [
        {
          name: "section-1",
          position: 1,
          products: [
            {
              name: "product-1",
              description: "description-1",
              price: 1,
              imageId: "1",
            },
            {
              name: "product-2",
              description: "description-2",
              price: 2,
              imageId: "2",
            },
          ],
        },
      ],
    };
    const input: RouterInputs["menus"]["createVersionWithNewProperties"] = {
      menuId: "1",
      properties: {
        title: "test",
        subtitle: "subtitle-test",
        image: null,
        deleteImage: false,
      },
    };
    const testParams: CreateNewVersionDataParams = {
      lastVersion,
      input,
      storage: storageMock,
    };

    const testImageId = "test-id";

    storageMock.upload.mockResolvedValueOnce(testImageId);

    // Act
    const data = await createNewVersionData(testParams);

    // Assert
    expect(storageMock.upload).toHaveBeenCalledTimes(0);
    expect(data.bgImageId).toBe(lastVersion.bgImageId);
    expect(data.title).toBe(input.properties.title);
    expect(data.subtitle).toBe(input.properties.subtitle);
    expect(Array.isArray(data.sections.create)).toBe(true);
  });
});

describe("createNewVersion", () => {
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  afterEach(() => {
    mockReset(prismaMock);
  });

  it("should call db service once with valid data", async () => {
    // Arrage
    const data: Awaited<ReturnType<typeof createNewVersionData>> = {
      menuId: "1",
      bgImageId: null,
      title: "test",
      subtitle: "subtitle-test",
      sections: {
        create: [
          {
            name: "section-1",
            position: 1,
            products: {
              create: [
                {
                  name: "product-1",
                  description: "description-1",
                  price: 1,
                  imageId: "1",
                },
                {
                  name: "product-2",
                  description: "description-2",
                  price: 2,
                  imageId: "2",
                },
              ],
            },
          },
        ],
      },
    };
    const testParams: CreateNewVersionParams = {
      data,
      prisma: prismaMock,
    };

    // Act
    await createNewVersion(testParams);

    // Assert
    expect(prismaMock.menuVersion.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.menuVersion.create).toHaveBeenCalledWith({
      data,
      select: {
        isPublic: true,
        title: true,
        subtitle: true,
        bgImageId: true,
      },
    });
  });

  it("should throw if db service fails", async () => {
    // Arrage
    const data: Awaited<ReturnType<typeof createNewVersionData>> = {
      menuId: "1",
      bgImageId: null,
      title: "test",
      subtitle: "subtitle-test",
      sections: {
        create: [
          {
            name: "section-1",
            position: 1,
            products: {
              create: [
                {
                  name: "product-1",
                  description: "description-1",
                  price: 1,
                  imageId: "1",
                },
                {
                  name: "product-2",
                  description: "description-2",
                  price: 2,
                  imageId: "2",
                },
              ],
            },
          },
        ],
      },
    };
    const testParams: CreateNewVersionParams = {
      data,
      prisma: prismaMock,
    };

    // Act
    prismaMock.menuVersion.create.mockRejectedValueOnce(
      new Error("test-error"),
    );

    // Assert
    await expect(createNewVersion(testParams)).rejects.toThrow();
  });

  it("should return created version data", async () => {
    // Arrage
    const data: Awaited<ReturnType<typeof createNewVersionData>> = {
      menuId: "1",
      bgImageId: null,
      title: "test",
      subtitle: "subtitle-test",
      sections: {
        create: [
          {
            name: "section-1",
            position: 1,
            products: {
              create: [
                {
                  name: "product-1",
                  description: "description-1",
                  price: 1,
                  imageId: "1",
                },
                {
                  name: "product-2",
                  description: "description-2",
                  price: 2,
                  imageId: "2",
                },
              ],
            },
          },
        ],
      },
    };
    const testParams: CreateNewVersionParams = {
      data,
      prisma: prismaMock,
    };

    const testVersion: CreatedMenuVersion = {
      isPublic: true,
      title: "test",
      subtitle: "subtitle-test",
      bgImageId: "1",
    };

    prismaMock.menuVersion.create.mockResolvedValueOnce(
      testVersion as MenuVersion,
    );

    // Act
    const result = await createNewVersion(testParams);

    // Assert
    expect(result).toEqual(testVersion);
  });
});

describe("deleteOldVersionBgImageFromStorageIfNeeded", () => {
  const storageMock = mockDeep<TrpcContext["storage"]>();

  afterEach(() => {
    mockReset(storageMock);
  });

  it("should not delete the image if the last version is public", async () => {
    // Arrage
    const input: RouterInputs["menus"]["createVersionWithNewProperties"] = {
      menuId: "1",
      properties: {
        title: "test",
        subtitle: "subtitle-test",
        image: null,
        deleteImage: false,
      },
    };
    const testParams: DeleteOldVersionBgImageFromStorageIfNeeded = {
      storage: storageMock,
      input,
      imageId: "testImageId",
      isLastVersionPublic: true,
    };

    // Act
    await deleteOldVersionBgImageFromStorageIfNeeded(testParams);

    // Assert
    expect(storageMock.deleteImage).not.toHaveBeenCalled();
  });

  it("should delete the image if the last version is not public and the conditions are met", async () => {
    // Arrange
    const input: RouterInputs["menus"]["createVersionWithNewProperties"] = {
      menuId: "1",
      properties: {
        title: "test",
        subtitle: "subtitle-test",
        image: null,
        deleteImage: true,
      },
    };
    const testParams: DeleteOldVersionBgImageFromStorageIfNeeded = {
      storage: storageMock,
      input,
      imageId: "testImageId",
      isLastVersionPublic: false,
    };

    // Act
    await deleteOldVersionBgImageFromStorageIfNeeded(testParams);

    // Assert
    expect(storageMock.deleteImage).toHaveBeenCalledTimes(1);
    expect(storageMock.deleteImage).toHaveBeenCalledWith(testParams.imageId);
  });

  it("should throw if image deletion fails", async () => {
    // Arrange
    const input: RouterInputs["menus"]["createVersionWithNewProperties"] = {
      menuId: "1",
      properties: {
        title: "test",
        subtitle: "subtitle-test",
        image: null,
        deleteImage: true,
      },
    };
    const testParams: DeleteOldVersionBgImageFromStorageIfNeeded = {
      storage: storageMock,
      input,
      imageId: "testImageId",
      isLastVersionPublic: false,
    };

    // Act
    storageMock.deleteImage.mockRejectedValueOnce(new Error("test-error"));

    // Assert
    await expect(
      deleteOldVersionBgImageFromStorageIfNeeded(testParams),
    ).rejects.toThrow();
  });
});

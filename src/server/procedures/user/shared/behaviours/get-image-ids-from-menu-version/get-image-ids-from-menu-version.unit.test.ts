import { describe, expect, it } from "vitest";

import {
  getImageIdsFromMenuVersion,
  type MenuVersion,
} from "./get-image-ids-from-menu-version.behaviour";

describe("getImageIdsFromMenuVersion", () => {
  it("should return an empty array if the input version is undefined", () => {
    // Arrange
    const version: MenuVersion | undefined = undefined;

    // Act
    const result = getImageIdsFromMenuVersion(version);

    // Assert
    expect(result).toEqual([]);
  });

  it("should return an array with only the bgImageId if the sections array is empty", () => {
    // Arrange
    const version: MenuVersion = { bgImageId: "123", sections: [] };

    // Act
    const result = getImageIdsFromMenuVersion(version);

    // Assert
    expect(result).toEqual(["123"]);
  });

  it("should return an array with all imageIds including the bgImageId", () => {
    // Arrange
    const version: MenuVersion = {
      bgImageId: "123",
      sections: [
        { products: [{ imageId: "image1" }, { imageId: "image2" }] },
        { products: [{ imageId: "image3" }] },
      ],
    };

    // Act
    const result = getImageIdsFromMenuVersion(version);

    // Assert
    expect(result).toEqual(["image1", "image2", "image3", "123"]);
  });

  it("should return an array with unique imageIds if there are duplicates", () => {
    // Arrange
    const version: MenuVersion = {
      bgImageId: "123",
      sections: [
        { products: [{ imageId: "image1" }, { imageId: "image2" }] },
        { products: [{ imageId: "image1" }] },
      ],
    };

    // Act
    const result = getImageIdsFromMenuVersion(version);

    // Assert
    expect(result).toEqual(["image1", "image2", "123"]);
  });
});

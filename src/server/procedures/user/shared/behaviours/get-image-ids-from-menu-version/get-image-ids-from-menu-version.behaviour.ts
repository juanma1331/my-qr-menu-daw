import type { IMenuVersion } from "~/server/procedures/interfaces";

export type MenuVersion = Pick<IMenuVersion, "bgImageId"> & {
  sections: {
    products: { imageId: string }[];
  }[];
};

/**
 * This function takes in a menu version object and returns an array of unique image IDs from its products and background image, if applicable.
 *
 * @param {MenuVersion | undefined} version - The menu version object to extract image IDs from.
 * @return {string[]} An array of unique image IDs.
 */

export const getImageIdsFromMenuVersion = (
  version: MenuVersion | undefined,
) => {
  if (!version) return [];

  const imagesIDs = new Set<string>();

  for (const section of version.sections) {
    for (const product of section.products) {
      imagesIDs.add(product.imageId);
    }
  }

  if (version.bgImageId) {
    imagesIDs.add(version.bgImageId);
  }

  return Array.from(imagesIDs);
};

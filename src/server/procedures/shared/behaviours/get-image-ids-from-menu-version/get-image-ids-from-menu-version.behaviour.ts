import type { IMenuVersion } from "~/server/procedures/intertaces";

export type MenuVersion = Pick<IMenuVersion, "bgImageId"> & {
  sections: {
    products: { imageId: string }[];
  }[];
};

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

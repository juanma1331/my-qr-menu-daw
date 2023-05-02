import { createMenuAndVersionProcedure } from "~/server/procedures/create-menu-and-version/create-menu-and-version.procedure";
import { createVersionWithNewProductProcedure } from "~/server/procedures/create-version-with-new-product/create-version-with-new-product.procedure";
import { createVersionWithSectionsProcedure } from "~/server/procedures/create-version-with-sections/create-version-with-sections.procedure";
import { createVersionWithoutDeletedProductProcedure } from "~/server/procedures/create-version-without-deleted-product/create-version-without-deleted-product.procedure";
import { deleteMenuProcedure } from "~/server/procedures/delete-menu/delete-menu.procedure";
import { getMenuPropertiesProcedure } from "~/server/procedures/get-menu-properties/get-menu-properties.procedure";
import { getProductsWithSectionsProcedure } from "~/server/procedures/get-products-with-sections/get-products-with-sections.procedure";
import { getPublicVersionProcedure } from "~/server/procedures/get-public-version/get-public-version.procedure";
import { getSectionsWithoutProductsProcedure } from "~/server/procedures/get-sections-without-products/get-sections-without-products.procedure";
import { publishVersionProcedure } from "~/server/procedures/publish-version/publish-version.procedure";
import { unpublishMenuVersionProcedure } from "~/server/procedures/unpublish-version/unpublish-version.procedure";
import { createTRPCRouter } from "../trpc";
import { createVersionWithPropertiesProcedure } from "./../../procedures/create-version-with-new-properties/create-version-with-new-properties.procedure";
import { getMenusInfoProcedure } from "./../../procedures/get-menus-info/get-menus-info.procedure";

export const menusRouter = createTRPCRouter({
  getMenusInfo: getMenusInfoProcedure,
  getMenuProperties: getMenuPropertiesProcedure,
  getSectionsWithoutProducts: getSectionsWithoutProductsProcedure,
  getProductsWithSections: getProductsWithSectionsProcedure,
  getPublicVersion: getPublicVersionProcedure,
  createMenuAndVersion: createMenuAndVersionProcedure,
  createVersionWithNewProperties: createVersionWithPropertiesProcedure,
  createVersionWithSections: createVersionWithSectionsProcedure,
  createVersionWithNewProduct: createVersionWithNewProductProcedure,
  createVersionWithoutDeletedProduct:
    createVersionWithoutDeletedProductProcedure,
  deleteMenu: deleteMenuProcedure,
  publishMenuVersion: publishVersionProcedure,
  unpublishMenuVersion: unpublishMenuVersionProcedure,
});

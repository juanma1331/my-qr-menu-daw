import { editUserMenuCreationLimitProcedure } from "~/server/procedures/admin/edit-user-menu-creation-limit/edit-user-menu-creation-limit.procedure";
import { getUsersInfoProcedure } from "~/server/procedures/admin/get-users-info/get-users-info.procedure";
import { createMenuAndVersionProcedure } from "~/server/procedures/user/create-menu-and-version/create-menu-and-version.procedure";
import { createVersionWithEditedProductProcedure } from "~/server/procedures/user/create-version-with-edited-product/create-version-with-edited-product.procedure";
import { createVersionWithNewProductProcedure } from "~/server/procedures/user/create-version-with-new-product/create-version-with-new-product.procedure";
import { createVersionWithPropertiesProcedure } from "~/server/procedures/user/create-version-with-new-properties/create-version-with-new-properties.procedure";
import { createVersionWithSectionsProcedure } from "~/server/procedures/user/create-version-with-sections/create-version-with-sections.procedure";
import { createVersionWithoutDeletedProductProcedure } from "~/server/procedures/user/create-version-without-deleted-product/create-version-without-deleted-product.procedure";
import { deleteMenuProcedure } from "~/server/procedures/user/delete-menu/delete-menu.procedure";
import { getMenuPropertiesProcedure } from "~/server/procedures/user/get-menu-properties/get-menu-properties.procedure";
import { getMenusInfoProcedure } from "~/server/procedures/user/get-menus-info/get-menus-info.procedure";
import { getProductProcedure } from "~/server/procedures/user/get-product/get-product.procedure";
import { getProductsWithSectionsProcedure } from "~/server/procedures/user/get-products-with-sections/get-products-with-sections.procedure";
import { getPublicVersionProcedure } from "~/server/procedures/user/get-public-version/get-public-version.procedure";
import { getSectionsWithoutProductsProcedure } from "~/server/procedures/user/get-sections-without-products/get-sections-without-products.procedure";
import { getVersionForPrevioProcedure } from "~/server/procedures/user/get-version-for-preview/get-version-for-preview.procedure";
import { publishVersionProcedure } from "~/server/procedures/user/publish-version/publish-version.procedure";
import { unpublishMenuVersionProcedure } from "~/server/procedures/user/unpublish-version/unpublish-version.procedure";
import { createTRPCRouter } from "../trpc";

export const menusRouter = createTRPCRouter({
  // User procedures
  getMenusInfo: getMenusInfoProcedure,
  getMenuProperties: getMenuPropertiesProcedure,
  getSectionsWithoutProducts: getSectionsWithoutProductsProcedure,
  getProductsWithSections: getProductsWithSectionsProcedure,
  getProduct: getProductProcedure,
  getPublicVersion: getPublicVersionProcedure,
  getVersionForPreview: getVersionForPrevioProcedure,
  createMenuAndVersion: createMenuAndVersionProcedure,
  createVersionWithNewProperties: createVersionWithPropertiesProcedure,
  createVersionWithSections: createVersionWithSectionsProcedure,
  createVersionWithNewProduct: createVersionWithNewProductProcedure,
  createVersionWithEditedProduct: createVersionWithEditedProductProcedure,
  createVersionWithoutDeletedProduct:
    createVersionWithoutDeletedProductProcedure,
  deleteMenu: deleteMenuProcedure,
  publishMenuVersion: publishVersionProcedure,
  unpublishMenuVersion: unpublishMenuVersionProcedure,
  // Admin procedures
  getUsersInfo: getUsersInfoProcedure,
  editUserMenuCreationLimit: editUserMenuCreationLimitProcedure,
});

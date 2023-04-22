import { createMenuAndVersionProcedure } from "~/server/procedures/create-menu-and-version/create-menu-and-version.procedure";
import { deleteMenuProcedure } from "~/server/procedures/delete-menu/delete-menu.procedure";
import { getMenuPropertiesProcedure } from "~/server/procedures/get-menu-properties/get-menu-properties.procedure";
import { getSectionsWithoutProductsProcedure } from "~/server/procedures/get-sections-without-products/get-sections-without-products.procedure";
import { createTRPCRouter } from "../trpc";
import { createVersionWithPropertiesProcedure } from "./../../procedures/create-version-with-new-properties/create-version-with-new-properties.procedure";
import { getMenusInfoProcedure } from "./../../procedures/get-menus-info/get-menus-info.procedure";
import { createVersionWithSectionsProcedure } from "~/server/procedures/create-version-with-sections/create-version-with-sections.procedure";

export const menusRouter = createTRPCRouter({
  getMenusInfo: getMenusInfoProcedure,
  getMenuProperties: getMenuPropertiesProcedure,
  getSectionsWithoutProducts: getSectionsWithoutProductsProcedure,
  createMenuAndVersion: createMenuAndVersionProcedure,
  createVersionWithNewProperties: createVersionWithPropertiesProcedure,
  createVersionWithSections: createVersionWithSectionsProcedure,
  deleteMenu: deleteMenuProcedure,
});

import { createMenuAndVersionProcedure } from "~/server/procedures/create-menu-and-version/create-menu-and-version.procedure";
import { deleteMenuProcedure } from "~/server/procedures/delete-menu/delete-menu.procedure";
import { getMenuPropertiesProcedure } from "~/server/procedures/get-menu-properties/get-menu-properties.procedure";
import { createTRPCRouter } from "../trpc";
import { createVersionWithPropertiesProcedure } from "./../../procedures/create-version-with-new-properties/create-version-with-new-properties.procedure";
import { getMenusInfoProcedure } from "./../../procedures/get-menus-info/get-menus-info.procedure";

export const menusRouter = createTRPCRouter({
  getMenusInfo: getMenusInfoProcedure,
  getMenuProperties: getMenuPropertiesProcedure,
  createMenuAndVersion: createMenuAndVersionProcedure,
  createVersionWithNewProperties: createVersionWithPropertiesProcedure,
  deleteMenu: deleteMenuProcedure,
});

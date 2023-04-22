import type { IMenuVersion, ISection } from "../intertaces";

export type MenuVersionForCreation = Pick<
  IMenuVersion,
  "title" | "subtitle" | "bgImageId"
>;

export type SectionFromCreatedVersion = Pick<ISection, "id" | "name">;

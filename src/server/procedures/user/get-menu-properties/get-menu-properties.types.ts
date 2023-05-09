import type { IMenuVersion } from "../../intertaces";

export type VersionQuery = Pick<
  IMenuVersion,
  "title" | "subtitle" | "isPublic" | "bgImageId"
>;

import type { IMenuVersion } from "../../interfaces";

export type VersionQuery = Pick<
  IMenuVersion,
  "title" | "subtitle" | "isPublic" | "bgImageId"
>;

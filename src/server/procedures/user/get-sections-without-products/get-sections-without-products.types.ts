import type { IMenuVersion, ISection } from "../../interfaces";

export type MenuVersionQuery = Pick<IMenuVersion, "isPublic"> & {
  sections: SectionQuery[];
};

export type SectionQuery = Pick<ISection, "id" | "name">;

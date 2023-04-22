import type { IMenuVersion, ISection } from "../intertaces";

export type MenuVersionQuery = Pick<IMenuVersion, "isPublic"> & {
  sections: SectionQuery[];
};

export type SectionQuery = Pick<ISection, "id" | "name">;

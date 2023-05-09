export type IRole = "ADMIN" | "USER";

export interface IUser {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  menuCreationLimit: number;
  role: IRole;
}

export interface IMenu {
  id: string;
  createdAt: Date;
  qrId: string;
  ownerId: string | null;
  owner: IUser | null;
  versions: IMenuVersion[];
}

export interface IMenuVersion {
  id: number;
  title: string;
  subtitle: string | null;
  isPublic: boolean;
  createdAt: Date;
  bgImageId: string | null;
  menuId: string;
  menu: IMenu;
  sections: ISection[];
}

export interface ISection {
  id: number;
  name: string;
  position: number;
  menuVersionId: number;
  menuVersion: IMenuVersion;
  products: IProduct[];
}

export interface IProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageId: string;
  sectionId: number;
  section: ISection;
}

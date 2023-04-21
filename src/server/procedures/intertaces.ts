export type Role = "ADMIN" | "USER";

export interface IUserRole {
  id: number;
  userId: string;
  user: IUser;
  role: Role;
}

export interface IUser {
  id: string;
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  menuCreationLimit: number;
  roles: IUserRole[];
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
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageId: string;
  sectionId: number;
  section: ISection;
}

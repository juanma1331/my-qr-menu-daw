import type { PrismaClient, Role, User } from "@prisma/client";
import { mockDeep, mockReset } from "vitest-mock-extended";

import type { qrService } from "~/server/services/qrService";
import type { storageService } from "~/server/services/storageService";
import { appRouter } from "../../server/api/root";

// TODO USE TrpcContext

const baseUser: User & { roles: Role[] } = {
  id: "testId",
  name: "testName",
  email: "testEmail",
  image: "testImage",
  emailVerified: new Date(),
  roles: [],
};

const prismaMock = mockDeep<PrismaClient>();
const storageMock = mockDeep<typeof storageService>();
const qrMock = mockDeep<typeof qrService>();

const createContext = (user: User & { roles: Role[] }) => ({
  session: { user, expires: "testexpires" },
  prisma: prismaMock,
  storage: storageMock,
  qr: qrMock,
});

const adminUser = { ...baseUser, roles: ["ADMIN", "USER"] as Role[] };
const simpleUser = { ...baseUser, roles: ["USER"] as Role[] };

const adminContext = createContext(adminUser);
const simpleContext = createContext(simpleUser);

export const resetTestContextMocks = () => {
  mockReset(prismaMock);
  mockReset(storageMock);
  mockReset(qrMock);
};

export const getAdminMocks = () => ({
  prismaMock: prismaMock,
  storageMock: storageMock,
  qrMock: qrMock,
  caller: appRouter.createCaller(adminContext),
});

export const getUserMocks = () => ({
  prismaMock: prismaMock,
  storageMock: storageMock,
  qrMock: qrMock,
  caller: appRouter.createCaller(simpleContext),
});

import type { User } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

import type { TrpcContext } from "~/server/api/trpc";
import {
  createMenuAndVersion,
  findUser,
  handleQrImage,
  type CreateMenuAndVersionParams,
  type FindUserParams,
  type HandleQrImageParams,
} from "./create-menu-and-version.behaviour";
import type { UserQuery } from "./create-menu-and-version.types";

describe("findUser", () => {
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  afterEach(() => {
    mockReset(prismaMock);
  });

  it("should find user successfully", async () => {
    // Arrange
    const userTestId = "1";
    const testUser: UserQuery = {
      menuCreationLimit: 3,
      _count: {
        menus: 1,
      },
    };
    const testParams: FindUserParams = {
      prisma: prismaMock,
      userId: userTestId,
    };

    prismaMock.user.findUnique.mockResolvedValueOnce(
      testUser as unknown as User,
    );

    // Act
    const foundUser = await findUser(testParams);
    // Assert
    expect(foundUser).toStrictEqual(testUser);
    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: userTestId },
      select: {
        menuCreationLimit: true,
        _count: {
          select: {
            menus: true,
          },
        },
      },
    });
  });

  it("should throw an error if user is not found", async () => {
    // Arrange
    const userId = "";
    const testParams: FindUserParams = { prisma: prismaMock, userId };

    // Act
    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    // Assert
    await expect(findUser(testParams)).rejects.toThrow();
  });
});

describe("handleQrImage", () => {
  const storageMock = mockDeep<TrpcContext["storage"]>();
  const qrGeneratorMock = mockDeep<TrpcContext["qr"]>();

  afterEach(() => {
    mockReset(storageMock);
    mockReset(qrGeneratorMock);
  });

  it("should generate and upload a QR code image successfully", async () => {
    // Arrange
    const qrContent = "";
    const testParams: HandleQrImageParams = {
      storage: storageMock,
      qrGenerator: qrGeneratorMock,
      qrContent,
    };
    const testQrImage = "test-qr-image";

    qrGeneratorMock.generateQr.mockResolvedValueOnce(testQrImage);

    // Act
    await handleQrImage(testParams);

    // Assert
    expect(qrGeneratorMock.generateQr).toHaveBeenCalledTimes(1);
    expect(qrGeneratorMock.generateQr).toHaveBeenCalledWith(qrContent);
    expect(storageMock.upload).toHaveBeenCalledTimes(1);
    expect(storageMock.upload).toHaveBeenCalledWith(testQrImage);
  });

  it("should throw an error if QR code generation fails", async () => {
    // Arrange
    const qrContent = "";
    const testParams: HandleQrImageParams = {
      storage: storageMock,
      qrGenerator: qrGeneratorMock,
      qrContent,
    };

    // Act
    qrGeneratorMock.generateQr.mockResolvedValueOnce(null);

    // Assert
    await expect(handleQrImage(testParams)).rejects.toThrow();
  });

  it("should throw an error if QR code upload fails", async () => {
    // Arrange
    const qrContent = "";
    const testParams: HandleQrImageParams = {
      storage: storageMock,
      qrGenerator: qrGeneratorMock,
      qrContent,
    };

    // Act
    storageMock.upload.mockRejectedValueOnce(new Error("test-error"));

    // Assert
    await expect(handleQrImage(testParams)).rejects.toThrow();
  });
});

describe("createMenuAndVersion", () => {
  const prismaMock = mockDeep<TrpcContext["prisma"]>();
  const storageMock = mockDeep<TrpcContext["storage"]>();
  const qrGeneratorMock = mockDeep<TrpcContext["qr"]>();

  afterEach(() => {
    mockReset(prismaMock);
    mockReset(storageMock);
    mockReset(qrGeneratorMock);
  });

  it("should create a menu and a version successfully", async () => {
    // Arrange
    const testParams: CreateMenuAndVersionParams = {
      prisma: prismaMock,
      userId: "1",
      menuId: "1",
      qrId: "1",
      title: "test-title",
    };

    // Act
    await createMenuAndVersion(testParams);

    // Assert
    expect(prismaMock.menu.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.menu.create).toHaveBeenCalledWith({
      data: {
        id: testParams.menuId,
        qrId: testParams.qrId,
        ownerId: testParams.userId,
        versions: {
          create: {
            title: testParams.title,
          },
        },
      },
    });
  });

  it("should throw an error if menu creation fails", async () => {
    // Arrange
    const testParams: CreateMenuAndVersionParams = {
      prisma: prismaMock,
      userId: "1",
      menuId: "1",
      qrId: "1",
      title: "test-title",
    };

    // Act
    prismaMock.menu.create.mockRejectedValueOnce(new Error("test-error"));

    // Assert
    await expect(createMenuAndVersion(testParams)).rejects.toThrow();
  });
});

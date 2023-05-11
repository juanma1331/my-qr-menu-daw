import type { Menu } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

import type { TrpcContext } from "~/server/api/trpc";
import {
  findAllMenusFromUser,
  getMenusInfo,
  type FindAllMenusFromUserParams,
} from "./get-menus-info.behaviour";
import type { MenuInfo, MenuQuery } from "./get-menus-info.types";

describe("findAllMenusFromUser", () => {
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  afterEach(() => {
    mockReset(prismaMock);
  });

  it("should return correct menu query for given user id", async () => {
    // Arrange
    const testParams: FindAllMenusFromUserParams = {
      userId: "1",
      prisma: prismaMock,
    };

    const testMenuQuery: MenuQuery[] = [
      {
        qrId: "1",
        versions: [
          {
            bgImageId: "1",
            isPublic: true,
            title: "title",
            menuId: "1",
            sections: [
              {
                _count: {
                  products: 1,
                },
              },
            ],
          },
        ],
      },
    ];

    prismaMock.menu.findMany.mockResolvedValueOnce(
      testMenuQuery as unknown as Menu[],
    );

    // Act
    const result = await findAllMenusFromUser(testParams);

    // Assert
    const sectionsInclude = { _count: { select: { products: true } } };

    const versionSelect = {
      title: true,
      isPublic: true,
      menuId: true,
      bgImageId: true,
      sections: {
        include: sectionsInclude,
      },
    };

    expect(prismaMock.menu.findMany).toHaveBeenCalledWith({
      where: {
        ownerId: testParams.userId,
      },
      select: {
        qrId: true,
        versions: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: versionSelect,
        },
      },
    });
    expect(result).toEqual(testMenuQuery);
  });

  it("should throw error if prisma findMany fails", async () => {
    // Arrange
    const testParams: FindAllMenusFromUserParams = {
      userId: "1",
      prisma: prismaMock,
    };

    // Act
    prismaMock.menu.findMany.mockRejectedValueOnce(new Error("some error"));

    // Assert
    await expect(findAllMenusFromUser(testParams)).rejects.toThrow();
  });
});

describe("getMenusInfo", () => {
  it("should return correct menu info for given menu queries", () => {
    // Arrange
    const testMenuQuery: MenuQuery[] = [
      {
        qrId: "1",
        versions: [
          {
            bgImageId: "1",
            isPublic: true,
            title: "title",
            menuId: "1",
            sections: [
              {
                _count: {
                  products: 1,
                },
              },
            ],
          },
        ],
      },
    ];

    const testMenuInfo: MenuInfo[] = [
      {
        isPublic: true,
        menuId: "1",
        title: "title",
        sections: 1,
        products: 1,
        qrImage: "1",
        menuImage: "1",
      },
    ];

    // Act
    const result = getMenusInfo(testMenuQuery);

    // Assert
    const menuInfo = testMenuInfo[0];
    expect(result).toEqual([
      {
        isPublic: menuInfo?.isPublic,
        menuId: menuInfo?.menuId,
        title: menuInfo?.title,
        sections: menuInfo?.sections,
        products: menuInfo?.products,
        qrImage: menuInfo?.qrImage,
        menuImage: menuInfo?.menuImage,
      },
    ]);
  });

  it("should throw if any menu query has no versions", () => {
    // Arrange
    const testMenuQuery: MenuQuery[] = [
      {
        qrId: "1",
        versions: [],
      },
    ];

    // Act
    // Assert
    expect(async () => getMenusInfo(testMenuQuery)).rejects.toThrow();
  });
});

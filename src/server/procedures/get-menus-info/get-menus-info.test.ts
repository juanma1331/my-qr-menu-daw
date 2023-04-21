import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";

import type { TrpcContext } from "~/server/api/trpc";
import {
  findAllMenusFromUser,
  getLatestVersions,
  type FindAllMenusFromUserParams,
} from "./get-menus-info.behaviour";
import type { MenuQuery } from "./get-menus-info.types";

describe("findAllMenusFromUser", () => {
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  it("should call prisma.menu.findMeny once", async () => {
    // Arrange
    const testParams: FindAllMenusFromUserParams = {
      prisma: prismaMock,
      userId: "testUserId",
    };

    prismaMock.menu.findMany.mockResolvedValueOnce([]);

    // Act
    await findAllMenusFromUser(testParams);

    // Expect
    expect(prismaMock.menu.findMany).toHaveBeenCalledTimes(1);

    const sectionsInclude = { _count: { select: { products: true } } };

    const versionSelect = {
      title: true,
      isPublic: true,
      menuId: true,
      sections: {
        include: sectionsInclude,
      },
    };

    expect(prismaMock.menu.findMany).toHaveBeenCalledWith({
      where: { ownerId: testParams.userId },
      select: {
        versions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: versionSelect,
        },
      },
    });
  });
});

describe("getLatestVersions", () => {
  it("should return the latest versions of the menus", () => {
    // Arrange
    const menus: MenuQuery[] = [
      {
        versions: [
          {
            menuId: "1",
            title: "testTitle",
            isPublic: true,
            sections: [
              {
                _count: {
                  products: 1,
                },
              },
            ],
          },
          {
            menuId: "1",
            title: "testTitle",
            isPublic: true,
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
      {
        versions: [
          {
            menuId: "2",
            title: "testTitle",
            isPublic: true,
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

    // Act
    const latestVersions = getLatestVersions(menus);

    // Expect
    const oneVersion = menus[0]!.versions[0];
    const secondVersion = menus[1]!.versions[0];
    expect(latestVersions).toEqual(
      expect.arrayContaining([oneVersion, secondVersion]),
    );
  });
});

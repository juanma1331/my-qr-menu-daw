import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";

import { appRouter } from "../../../api/root";
import { createInnerTRPCContext, type TrpcContext } from "../../../api/trpc";
import {
  findAllMenusFromUser,
  type FindAllMenusFromUserParams,
} from "./get-menus-info.behaviour";

describe("findAllMenusFromUser", () => {
  const prismaMock = mockDeep<TrpcContext["prisma"]>();

  it("should call prisma.menu.findMany once", async () => {
    // Arrange
    const ctx = await createInnerTRPCContext({ session: null });
    const caller = appRouter.createCaller(ctx);
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

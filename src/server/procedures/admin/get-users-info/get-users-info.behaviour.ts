import type { TrpcContext } from "~/server/api/trpc";
import type { UserQuery } from "./get-users-info.types";

export type FindUsersParams = {
  prisma: TrpcContext["prisma"];
};

export const findUsers = async ({
  prisma,
}: FindUsersParams): Promise<UserQuery[]> => {
  const users = await prisma.user.findMany({
    where: {
      role: "USER",
    },
    select: {
      id: true,
      email: true,
      menuCreationLimit: true,
      _count: {
        select: {
          menus: true,
        },
      },
    },
  });

  return users.map((user) => ({
    id: user.id,
    email: user.email,
    menuCreationLimit: user.menuCreationLimit,
    createdMenus: user._count.menus,
  }));
};

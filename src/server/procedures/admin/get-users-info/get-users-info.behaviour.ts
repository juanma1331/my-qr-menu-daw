import type { TrpcContext } from "~/server/api/trpc";
import type { UserQuery } from "./get-users-info.types";

export type FindUsersParams = {
  prisma: TrpcContext["prisma"];
};

/**
 * Find users function that returns an array of users.
 *
 * @async
 * @function findUsers
 * @param {object} params - The parameters object.
 * @param {object} params.prisma - The Prisma client instance.
 * @returns {Promise<UserQuery[]>} An array of user objects that includes id, email, menuCreationLimit and createdMenus.
 */
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

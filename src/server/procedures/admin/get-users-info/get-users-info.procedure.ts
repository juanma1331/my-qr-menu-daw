import { adminProcedure } from "~/server/api/trpc";
import { findUsers } from "./get-users-info.behaviour";
import { getUsersInfoOutputSchema } from "./get-users-info.schema";

export const getUsersInfoProcedure = adminProcedure
  .output(getUsersInfoOutputSchema)
  .query(async ({ ctx }) => {
    const users = await findUsers({
      prisma: ctx.prisma,
    });

    return {
      users,
    };
  });

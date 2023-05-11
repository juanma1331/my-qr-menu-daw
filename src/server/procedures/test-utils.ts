import type { Session } from "next-auth";

import { prisma } from "~/server/db";
import { createInnerTRPCContext } from "../api/trpc";

export const createTestContext = (user: Session["user"]) => {
  const session: Session = {
    expires: "",
    user,
  };

  return {
    user,
    ctx: createInnerTRPCContext({ session }),
  };
};

export const clearAllTables = async () => {
  await prisma.user.deleteMany();
  await prisma.menu.deleteMany();
};

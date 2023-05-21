import type { GetServerSidePropsContext } from "next";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { Role } from "@prisma/client";
import {
  getServerSession,
  type Account,
  type DefaultSession,
  type DefaultUser,
  type NextAuthOptions,
  type User,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

import { env } from "../env.mjs";
import { prisma } from "./db";

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      role: Role;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: Role;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }

      return session;
    },

    signIn({ user }) {
      const allowed = [
        "juanma131313@gmail.com",
        "juanma1331@gmail.com",
        "rubia_159@hotmail.com",
      ];
      if (user.email && allowed.includes(user.email)) {
        return true;
      }

      return false;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),

    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     **/
  ],
  pages: {
    signOut: "auth/logout",
  },
  events: {
    signIn: async ({ user, account, isNewUser }) => {
      await addAdminRoleToUserOnFirstSignIn({ user, account, isNewUser });
    },
  },
};

// Auth utils
type AddAdminRoleToUserOnFirstSignInParams = {
  user: User;
  account: Account | null;
  isNewUser: boolean | undefined;
};
async function addAdminRoleToUserOnFirstSignIn({
  user,
  account,
  isNewUser,
}: AddAdminRoleToUserOnFirstSignInParams) {
  const isAdminLoginForFirstTime =
    isNewUser &&
    account &&
    account.provider === "discord" &&
    user.email === "rubia_159@hotmail.com";

  if (isAdminLoginForFirstTime) {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        role: "ADMIN",
      },
    });
  }
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

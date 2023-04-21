import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Center } from "@mantine/core";
import { signIn, useSession } from "next-auth/react";

import LoginForm from "~/components/Auth/LoginForm";

const LoginPage: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  if (status === "loading") return null;

  if (status === "authenticated") void router.push("/menus");

  return (
    <Center h="100vh">
      <LoginForm
        onDiscordLogin={() => signIn("discord", { callbackUrl: "/menus" })}
      />
    </Center>
  );
};

export default LoginPage;

import { useRouter } from "next/router";
import { Box, Divider, Stack, Text, createStyles } from "@mantine/core";
import { IconBrandDiscord } from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react";

import AuthLayout from "~/components/Layout/AuthLayout";
import BrandLogo from "~/components/Shared/BrandLogo";
import Button from "~/components/Shared/Button";
import PageSectionTitle from "~/components/Shared/Page/PageSectionTitle";
import type { NextPageWithLayout } from "./_app";

const useStyles = createStyles(() => ({
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "5rem",
  },
  login: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  },
}));

const EntryPage: NextPageWithLayout = () => {
  const { classes } = useStyles();
  const { data, status } = useSession();
  const router = useRouter();

  if (status === "loading") return null;

  if (status === "authenticated") {
    if (data.user.role === "ADMIN") {
      void router.push("/admin");
    } else {
      void router.push("/menus");
    }
  }

  return (
    <Box className={classes.root}>
      <BrandLogo fontSize="xl" qrSize={62} />

      <Box className={classes.login}>
        <Box>
          <PageSectionTitle mt="lg" align="center" order={2}>
            Acceso a su cuenta
          </PageSectionTitle>
          <Text mt="xs" size="sm" color="cGray.4">
            Acceda mediante autenticación externa
          </Text>
        </Box>

        <Divider />

        <Stack w="100%" maw="20rem">
          <Button
            size="md"
            color="indigo.5"
            radius={30}
            fullWidth
            variant="outline"
            onClick={() => signIn("discord", { callbackUrl: "/menus" })}
            leftIcon={<IconBrandDiscord size={20} />}
          >
            Discord
          </Button>

          <Button
            size="md"
            color="cPink.3"
            radius={30}
            fullWidth
            variant="outline"
            onClick={() => signIn("discord", { callbackUrl: "/admin" })}
          >
            Admin
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

EntryPage.getLayout = (page) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default EntryPage;

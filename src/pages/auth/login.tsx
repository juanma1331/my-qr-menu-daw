import Image from "next/image";
import { useRouter } from "next/router";
import { Box, Divider, MediaQuery, Text, createStyles } from "@mantine/core";
import { IconBrandDiscord } from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react";

import AuthLayout from "~/components/Layout/AuthLayout";
import BrandLogo from "~/components/Shared/BrandLogo";
import Button from "~/components/Shared/Button";
import PageSectionTitle from "~/components/Shared/Page/PageSectionTitle";
import login from "../../../public/images/illustrations/login.svg";
import type { NextPageWithLayout } from "../_app";

const useStyles = createStyles(() => ({
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "10rem",
  },
  rootContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10rem",
  },
  login: {
    gap: "2rem",
    display: "flex",
    flexDirection: "column",
    transform: "translate(-20px, -20px)",
  },
  illustration: {
    height: "300px",
    width: "400px",
    transform: "translateX(-90px)",
  },
}));

const LoginPage: NextPageWithLayout = () => {
  const { classes } = useStyles();
  const { status } = useSession();
  const router = useRouter();

  if (status === "loading") return null;

  if (status === "authenticated") void router.push("/");

  return (
    <Box className={classes.root}>
      <BrandLogo fontSize="xl" qrSize={62} />

      <Box className={classes.rootContainer}>
        <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
          <Image
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            src={login}
            className={classes.illustration}
            alt="una mujer mostrando una página de login de un sitio web"
          />
        </MediaQuery>

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

          <Button
            size="md"
            color="indigo.5"
            radius={30}
            fullWidth
            variant="outline"
            onClick={() => signIn("discord", { callbackUrl: "/" })}
            leftIcon={<IconBrandDiscord />}
          >
            Discord
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

LoginPage.getLayout = (page) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default LoginPage;

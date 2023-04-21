import { Button } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";

const LogoutButton = () => {
  const { status } = useSession();

  if (status === "loading") return null;

  return (
    <Button
      rightIcon={<IconLogout size={18} />}
      variant="outline"
      onClick={() => signOut({ callbackUrl: "/" })}
      size="sm"
      color="gray"
    >
      Salir
    </Button>
  );
};

export default LogoutButton;

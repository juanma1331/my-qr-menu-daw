import { IconLogout } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";

import ActionIcon from "../ActionIcon";

const LogoutButton = () => {
  const { status } = useSession();

  if (status === "loading") return null;

  return (
    <ActionIcon
      variant="outline"
      color="cGray.3"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      <IconLogout size={18} />
    </ActionIcon>
  );
};

export default LogoutButton;

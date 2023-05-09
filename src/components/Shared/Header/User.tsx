import { Text } from "@mantine/core";
import { useSession } from "next-auth/react";

const User: React.FC = () => {
  const { data, status } = useSession();

  if (status === "loading" || status === "unauthenticated" || !data)
    return null;

  return (
    <Text color="cGray.3" size="xs">
      {data.user.email}
    </Text>
  );
};

export default User;

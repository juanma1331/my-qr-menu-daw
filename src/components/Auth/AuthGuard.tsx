import { useEffect, type ReactElement } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

type AuthProps = {
  role: string;
  loading: ReactElement;
};

export type WithAuthentication<P = unknown> = P & {
  auth?: AuthProps;
};

type AuthGuardProps = {
  children: ReactElement;
  auth: AuthProps; // Implementar roles
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children, auth }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const user = !!session?.user;

  useEffect(() => {
    if (!user) void router.push("/auth/login");
  }, [user, router]);

  if (user) return children;

  return auth.loading;
};

export default AuthGuard;

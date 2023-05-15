import { type ReactElement } from "react";
import { useSession } from "next-auth/react";

import type { IRole } from "~/server/procedures/interfaces";
import UnAuthorizedPageError from "../Shared/Page/PageError/UnAuthorizedPageError";

type AuthProps = {
  role: IRole;
  loading: ReactElement;
};

export type WithAuthentication<P = unknown> = P & {
  auth?: AuthProps;
};

type AuthGuardProps = {
  children: ReactElement;
  auth: AuthProps;
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children, auth }) => {
  const { data: session, status } = useSession();

  const hasUser = !!session?.user;
  const isValidRole = session?.user?.role === auth.role;

  if (hasUser && isValidRole) return children;

  if ((!hasUser || !isValidRole) && status !== "loading") {
    return (
      <UnAuthorizedPageError error="Lo sentimos, no tienes acceso a este sitio" />
    );
  }

  return auth.loading;
};

export default AuthGuard;

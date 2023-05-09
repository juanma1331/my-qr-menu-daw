import unauthorized from "../../../../../public/images/illustrations/unauthorized.svg";
import PageError from "./PageError";

export type UnAuthorizedPageErrorProps = {
  error: string;
};

const UnAuthorizedPageError: React.FC<UnAuthorizedPageErrorProps> = ({
  error,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return <PageError error={error} illustration={unauthorized} />;
};

export default UnAuthorizedPageError;

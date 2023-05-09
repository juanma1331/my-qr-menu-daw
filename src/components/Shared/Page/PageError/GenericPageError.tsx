import generic from "../../../../../public/images/illustrations/generic.svg";
import PageError from "./PageError";

export type GenericPageErrorProps = {
  error: string;
};

const GenericPageError: React.FC<GenericPageErrorProps> = ({ error }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return <PageError error={error} illustration={generic} />;
};

export default GenericPageError;

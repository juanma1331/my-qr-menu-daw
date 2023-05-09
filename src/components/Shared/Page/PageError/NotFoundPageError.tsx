import { Box } from "@mantine/core";

import notfound from "../../../../../public/images/illustrations/not-found.svg";
import BrandLogo from "../../BrandLogo";
import PageError from "./PageError";

export type NotFoundPageErrorProps = {
  error: string;
};

const NotFoundPageError: React.FC<NotFoundPageErrorProps> = ({ error }) => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <PageError error={error} illustration={notfound}>
      <Box sx={{ marginBottom: "10rem" }}>
        <BrandLogo qrSize={64} fontSize="lg" />
      </Box>
    </PageError>
  );
};

export default NotFoundPageError;

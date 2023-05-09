import { Loader } from "@mantine/core";

import PageCenter from "./PageCenter";

const PageLoader: React.FC = () => {
  return (
    <PageCenter>
      <Loader color="cPink.2" />
    </PageCenter>
  );
};

export default PageLoader;

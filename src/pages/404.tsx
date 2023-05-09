import type { NextPage } from "next";

import NotFoundPageError from "~/components/Shared/Page/PageError/NotFoundPageError";

const Page404: NextPage = () => {
  return (
    <NotFoundPageError error="Lo sentimos, pero el recurso al que intentas acceder no existe" />
  );
};

export default Page404;

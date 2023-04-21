import { useRouter } from "next/router";
import { useEffect } from "react";

type UseAutoCloseOnNavigatingProps = {
  closeHandler: () => void;
};

const useAutoCloseOnNavigating = ({
  closeHandler,
}: UseAutoCloseOnNavigatingProps) => {
  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeComplete", closeHandler);

    return () => router.events.off("routeChangeComplete", closeHandler);
  }, [router.asPath]);
};

export default useAutoCloseOnNavigating;

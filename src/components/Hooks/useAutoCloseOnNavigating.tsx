import { useEffect } from "react";
import { useRouter } from "next/router";

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
  }, [router.asPath, closeHandler, router.events]);
};

export default useAutoCloseOnNavigating;

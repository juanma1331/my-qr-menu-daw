import type { PropsWithChildren } from "react";
import { Alert, type AlertProps } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

const ErrorAlert: React.FC<PropsWithChildren<AlertProps>> = ({
  children,
  ...rest
}) => {
  return (
    <Alert icon={<IconAlertCircle size="1rem" />} color="red.4" {...rest}>
      {children}
    </Alert>
  );
};

export default ErrorAlert;

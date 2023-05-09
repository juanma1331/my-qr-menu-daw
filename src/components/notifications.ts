import { notifications, type NotificationProps } from "@mantine/notifications";

export type NotificateProps = {
  title: string;
  message: string;
};

export const notificateError = (props: NotificationProps): void => {
  notifications.show({
    color: "red.5",
    ...props,
  });
};

export const notificateSuccess = (props: NotificationProps): void => {
  notifications.show({
    color: "cEmerald.5",
    ...props,
  });
};

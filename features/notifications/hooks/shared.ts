export const notificationQueryKeys = {
  all: ["notifications"],
  token: () => [...notificationsQueryKeys.all, "token"],
};

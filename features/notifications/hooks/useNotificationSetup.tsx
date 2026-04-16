import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useEffect } from "react";
import { useRegisterPushToken } from "./useRegisterPushToken";

/**
 * Handles push notification registration for authenticated users.
 *
 * Call this hook once inside the (auth) layout. It registers the device
 * for push notifications, retrieves the Expo push token from Apple/Google,
 * and sends it to the backend so the server can deliver notifications
 * for order events, shipping updates, and promotions.
 */
export const useNotificationSetup = () => {
  const { expoPushToken } = usePushNotifications();
  const { mutate: registerToken } = useRegisterPushToken();

  useEffect(() => {
    if (expoPushToken?.data) {
      registerToken({ token: expoPushToken.data });
    }
  }, [expoPushToken]);
};

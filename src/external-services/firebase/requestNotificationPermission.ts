import { getToken } from "firebase/messaging";
import { apiRequestService } from "../../factories/apiRequestService";
import { getMessagingInstance } from "./init";
import { getOrCreateInstallationId } from "./installationIdKey";

export const requestNotificationPermission = async () => {
  try {
    const installationId = getOrCreateInstallationId();
    if (!installationId) {
      console.warn('No installation_id available; aborting notification setup.');
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      return;
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    if (!registration) {
      return;
    }

    // Initialize Firebase lazily when user action requires it
    const messaging = getMessagingInstance();
    if (!messaging) {
      console.warn('Could not initialize Firebase messaging');
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      return;
    }

    try {
      await apiRequestService.reqAccountFCMDeviceCreate({
        fcm_token: token,
        installation_id: installationId,
        platform: 'web'
      });
    } catch {
      await apiRequestService.reqAccountFCMDeviceUpdate({
        new_fcm_token: token,
        installation_id: installationId,
        previous_fcm_token: token,
        platform: 'web'
      });
    }
  } catch (error) {
    alert("Error requesting notification permission. See console for details.");
    console.error("Error Requesting Notification Permission:", error);
    return;
  }
};

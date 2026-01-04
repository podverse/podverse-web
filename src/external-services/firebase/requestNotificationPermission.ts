import { apiRequestService } from "../../factories/apiRequestService";
import { getToken, messaging } from "./init";
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
      });
    } catch {
      await apiRequestService.reqAccountFCMDeviceUpdate({
        previous_fcm_token: token,
        new_fcm_token: token,
        installation_id: installationId,
      });
    }
  } catch (error) {
    alert("Error requesting notification permission. See console for details.");
    console.error("Error Requesting Notification Permission:", error);
    return;
  }
};

import { apiRequestService } from "../../../factories/apiRequestService";
import { config } from "../../../config";

/**
 * Converts a base64 VAPID public key to a Uint8Array for the Push API
 */
function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer;
}

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const vapidPublicKey = config.public.notifications.webpush.vapidPublicKey;
    if (!vapidPublicKey) {
      console.warn('No VAPID public key available; aborting notification setup.');
      return false;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log('Notification permission not granted');
      return false;
    }

    // Register the service worker
    const registration = await navigator.serviceWorker.register(
      "/webpush-sw.js"
    );

    if (!registration) {
      console.error('Failed to register service worker');
      return false;
    }

    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    if (!subscription) {
      console.error('Failed to create push subscription');
      return false;
    }

    // Extract the subscription details
    const subscriptionJson = subscription.toJSON();
    const endpoint = subscriptionJson.endpoint;
    const p256dh = subscriptionJson.keys?.p256dh;
    const auth = subscriptionJson.keys?.auth;

    if (!endpoint || !p256dh || !auth) {
      console.error('Invalid subscription data');
      return false;
    }

    // Send subscription to the server
    try {
      await apiRequestService.reqAccountWebPushDeviceCreate({
        endpoint,
        p256dh,
        auth
      });
    } catch {
      // If create fails, try update (device might already exist)
      await apiRequestService.reqAccountWebPushDeviceUpdate({
        endpoint,
        p256dh,
        auth
      });
    }

    return true;
  } catch (error) {
    alert("Error requesting notification permission. See console for details.");
    console.error("Error Requesting Notification Permission:", error);
    return false;
  }
};

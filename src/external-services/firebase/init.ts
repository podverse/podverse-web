import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, deleteToken } from "firebase/messaging";
import { config } from "../../config";

let messaging: ReturnType<typeof getMessaging>;

if (typeof window !== "undefined" && "navigator" in window) {
  const app = initializeApp(config.public.externalServices.firebase);
  messaging = getMessaging(app);

  // Set up foreground notification handling
  // When using data-only messages (no "notification" field),
  // FCM won't auto-display notifications when the app is in the foreground.
  onMessage(messaging, (payload) => {
    // Show notification when the page is visible (foreground).
    // FCM routes messages here when the page is visible, even if not focused.
    // The service worker's onBackgroundMessage only fires when the page is hidden/closed.

    // For data-only messages, the data is in payload.data
    const data = payload.data || {};
    const title = data.title || payload.notification?.title || 'Notification';
    const body = data.body || payload.notification?.body || '';
    const icon = data.icon || payload.notification?.icon;
    const link = data.link || '/';

    if (Notification.permission === 'granted' && title) {
      const notification = new Notification(title, {
        body,
        icon,
        data: { url: link },
      });

      notification.onclick = (event) => {
        event.preventDefault();
        notification.close();
        if (link && link !== '/') {
          window.open(link, '_blank');
        } else {
          window.focus();
        }
      };
    }
  });
}

export { messaging, getToken, onMessage, deleteToken };

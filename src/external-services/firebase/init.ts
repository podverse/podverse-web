import { initializeApp, FirebaseApp } from "firebase/app";
import { getMessaging, getToken, onMessage, deleteToken, Messaging } from "firebase/messaging";
import { config } from "../../config";

let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;
let initialized = false;

/**
 * Initialize Firebase lazily. This should only be called when:
 * 1. The logged-in account has notification channels configured, OR
 * 2. A user action explicitly requires Firebase (e.g., enabling notifications)
 */
export function initializeFirebase(): Messaging | null {
  if (initialized) {
    return messaging;
  }

  if (typeof window === "undefined" || !("navigator" in window)) {
    return null;
  }

  app = initializeApp(config.public.externalServices.firebase);
  messaging = getMessaging(app);
  initialized = true;

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

  return messaging;
}

/**
 * Get the messaging instance, initializing Firebase if needed.
 * Use this when a user action requires Firebase.
 */
export function getMessagingInstance(): Messaging | null {
  if (!initialized) {
    return initializeFirebase();
  }
  return messaging;
}

/**
 * Check if Firebase has been initialized.
 */
export function isFirebaseInitialized(): boolean {
  return initialized;
}

export { messaging, getToken, onMessage, deleteToken };

**Firebase Integration**

This repository now includes a minimal Firebase Cloud Messaging integration so users can opt in to receive web push notifications.

Files added
- `src/external-services/firebase/init.ts` — lazy initialization of Firebase app and messaging instance.
- `src/external-services/firebase/requestNotificationPermission.ts` — requests Notification permission and obtains an FCM token using a VAPID key.
- `src/external-services/firebase/disableNotificationPermission.ts` — disables notifications and cleans up FCM registration.
- `src/external-services/firebase/installationIdKey.ts` — manages a unique installation ID in localStorage.
- `public/firebase-messaging-sw.js` — service worker that displays notifications when the app is in the background.

Lazy Loading

Firebase is **not** initialized automatically on page load. Instead, it uses lazy initialization to avoid loading Firebase resources until actually needed:

1. **Conditional initialization on login**: The `NotificationsContext` only initializes Firebase if the logged-in account has `account_notification_channels`. If the user has no notification channels configured, Firebase is never loaded.

2. **User-action triggered initialization**: When a user explicitly enables notifications (e.g., from the Settings panel), Firebase is initialized on-demand via `getMessagingInstance()`.

Key functions in `init.ts`:
- `initializeFirebase()` — initializes Firebase app and messaging, sets up foreground message handling. Only runs once.
- `getMessagingInstance()` — returns the messaging instance, calling `initializeFirebase()` if not already initialized.
- `isFirebaseInitialized()` — returns whether Firebase has been initialized (useful for cleanup operations).

This approach ensures:
- Users without notifications enabled never load Firebase SDK resources
- Firebase is only initialized when there's an actual need for push messaging
- The initialization happens transparently when needed

Quick setup

1. Create a Firebase project and enable Cloud Messaging.
2. Obtain the Web Push certificate key (VAPID public key) from the Firebase console.
3. Add the following environment variables to `.env.local` (Next.js will expose `NEXT_PUBLIC_*` to the browser):
   - NEXT_PUBLIC_FIREBASE_API_KEY
   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   - NEXT_PUBLIC_FIREBASE_PROJECT_ID
   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   - NEXT_PUBLIC_FIREBASE_APP_ID
   - NEXT_PUBLIC_FIREBASE_VAPID_KEY (the public VAPID key)

Service worker

- `public/firebase-messaging-sw.js` is served at `/firebase-messaging-sw.js` and will be picked up by FCM when you register the token.

Server-side

- Store FCM tokens per-user and use the Firebase Admin SDK or the FCM HTTP API to send notifications.

Limitations

- This is a lightweight integration for browsers that support the Web Push / Notifications APIs. Test on supported browsers only.
- For production use, replace placeholders in `public/firebase-messaging-sw.js` with actual build-time values if needed.

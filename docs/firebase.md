**Firebase Integration**

This repository now includes a minimal Firebase Cloud Messaging integration so users can opt in to receive web push notifications.

Files added
- `src/external-services/firebase/init.ts` — initializes Firebase app and returns a messaging instance when supported.
- `src/external-services/firebase/messaging.ts` — requests Notification permission and obtains an FCM token using a VAPID key.
- `public/firebase-messaging-sw.js` — service worker that displays notifications when the app is in the background.

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

Client usage example

1. Prompt the user to enable notifications (e.g. a settings screen).
2. Call the helper to request permission and get a token:

```
import requestNotificationPermission from '../firebase/messaging'

async function enableNotifications() {
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || ''
  const { granted, token } = await requestNotificationPermission(vapidKey)
  if (granted && token) {
    // send token to your backend to register this device for notifications
  }
}
```

Service worker

- `public/firebase-messaging-sw.js` is served at `/firebase-messaging-sw.js` and will be picked up by FCM when you register the token.

Server-side

- Store FCM tokens per-user and use the Firebase Admin SDK or the FCM HTTP API to send notifications.

Limitations

- This is a lightweight integration for browsers that support the Web Push / Notifications APIs. Test on supported browsers only.
- For production use, replace placeholders in `public/firebase-messaging-sw.js` with actual build-time values if needed.

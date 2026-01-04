try {
  importScripts('https://www.gstatic.com/firebasejs/12.7.0/firebase-app-compat.js')
  importScripts('https://www.gstatic.com/firebasejs/12.7.0/firebase-messaging-compat.js')
} catch (e) {
  console.warn('importScripts failed in service worker:', e)
}

try {
  const firebaseConfig = __FIREBASE_CONFIG__;

  firebase.initializeApp(firebaseConfig);

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage(async (payload) => {
    try {
      // prefer webpush.data fields if present (FCM sends data as strings)
      const data = payload.data || payload?.webpush?.data || {};
      const notificationTitle = data.title || payload.notification?.title || 'Notification';
      const notificationOptions = {
        body: data.body || payload.notification?.body,
        icon: data.icon || payload.notification?.icon,
        data: { url: data.link || payload.fcmOptions?.link || "/" },
      };

      await self.registration.showNotification(notificationTitle, notificationOptions);
    } catch (e) {
      console.error('showNotification error:', e);
    }
  });

  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const targetUrl = event.notification.data?.url || "/";

    event.waitUntil(
      clients
        .matchAll({
          type: "window",
          includeUncontrolled: true,
        })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url.includes(targetUrl) && "focus" in client) {
              return client.focus();
            }
          }
          return clients.openWindow(targetUrl);
        })
    );
  });
} catch (err) {
  // surface any runtime/init errors in the SW console
  console.error('firebase-messaging-sw initialization error:', err);
}

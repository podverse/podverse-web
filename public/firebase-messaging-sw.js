try {
  importScripts('https://www.gstatic.com/firebasejs/12.7.0/firebase-app-compat.js')
  importScripts('https://www.gstatic.com/firebasejs/12.7.0/firebase-messaging-compat.js')
} catch (e) {
  console.warn('importScripts failed in service worker:', e)
}

try {
  const firebaseConfig = {
    apiKey: "AIzaSyCeIP6KDq4ZbP7s6psFQcgxshPRnQthS0Q",
    authDomain: "podverse-2.firebaseapp.com",
    projectId: "podverse-2",
    storageBucket: "podverse-2.firebasestorage.app",
    appId: "1:388706542922:web:69b50bd0c7b1811f5f8db3",
    messagingSenderId: "388706542922",
  };

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

// Web Push Service Worker for native push notifications

self.addEventListener('push', async (event) => {
  try {
    // Check if there's a focused client - if so, skip showing notification
    // (the client can handle it via the message event)
    const clientList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    const hasFocusedClient = clientList.some(client => client.focused === true);

    if (hasFocusedClient) {
      // Post message to focused client for foreground handling
      const data = event.data ? event.data.json() : {};
      clientList.forEach(client => {
        if (client.focused) {
          client.postMessage({
            type: 'PUSH_NOTIFICATION',
            payload: data
          });
        }
      });
      return;
    }

    // Parse the push message data
    const data = event.data ? event.data.json() : {};
    
    const notificationTitle = data.title || 'Podverse';
    const notificationOptions = {
      body: data.body || '',
      icon: data.icon || '/favicon/web-app-manifest-192x192.png',
      badge: '/favicon/favicon-96x96.png',
      data: { 
        url: data.link || '/' 
      },
      // Require interaction to ensure user notices the notification
      requireInteraction: false,
      // Auto-close after a while
      tag: 'podverse-notification-' + Date.now(),
    };

    // Add image if available
    if (data.image) {
      notificationOptions.image = data.image;
    }

    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  } catch (e) {
    console.error('Push event error:', e);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Check if there's already a window open on the target URL
        for (const client of clientList) {
          // If the target matches or it's the root, focus the existing window
          if ((client.url.includes(targetUrl) || targetUrl === '/') && 'focus' in client) {
            // Navigate to the specific URL if needed
            if (!client.url.includes(targetUrl) && targetUrl !== '/') {
              client.navigate(targetUrl);
            }
            return client.focus();
          }
        }
        // Otherwise open a new window
        return clients.openWindow(targetUrl);
      })
  );
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

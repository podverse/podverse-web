import { apiRequestService } from '../../factories/apiRequestService';
import { getToken, messaging, deleteToken } from './init';
import { getInstallationId } from './installationIdKey';

export async function disableNotificationPermission(): Promise<void> {
  try {
    const installationId = getInstallationId();

    // Try to get the current FCM token (best-effort)
    let token: string | undefined;
    try {
      const registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
      token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration || undefined,
      });
    } catch (e) {
      console.warn('Could not retrieve FCM token during disable', e);
      token = undefined;
    }

    // Attempt to unsubscribe any push subscription and unregister service workers
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) {
        try {
          const sub = await r.pushManager.getSubscription();
          if (sub) {
            await sub.unsubscribe();
          }
        } catch (e) {
          console.warn('Failed to unsubscribe push subscription', e);
        }
        try {
          await r.unregister();
        } catch (e) {
          console.warn('Failed to unregister service worker', e);
        }
      }
    } catch (e) {
      console.warn('Failed to enumerate/unregister service workers', e);
    }

    // If we have an installation id or token, tell the server to delete registration
    if (installationId || token) {
      await apiRequestService.reqAccountFCMDeviceDelete({
        installation_id: installationId || undefined,
        fcm_token: token || undefined
      });
    }

    try {
      if (typeof deleteToken === 'function') {
        await deleteToken(messaging);
      }
    } catch (e) {
      console.warn('Failed to delete Firebase token', e);
    }
  } catch (error) {
    console.error('Error disabling notifications', error);
  }
}

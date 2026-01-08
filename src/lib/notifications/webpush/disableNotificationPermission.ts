import { apiRequestService } from '../../../factories/apiRequestService';

export async function disableNotificationPermission(): Promise<void> {
  try {
    // Get the current push subscription
    const registration = await navigator.serviceWorker.getRegistration('/webpush-sw.js');
    
    if (registration) {
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        const endpoint = subscription.endpoint;
        
        // Unsubscribe from push
        await subscription.unsubscribe();
        
        // Tell the server to delete the subscription
        if (endpoint) {
          try {
            await apiRequestService.reqAccountWebPushDeviceDelete({
              endpoint
            });
          } catch (e) {
            console.warn('Failed to delete WebPush device from server', e);
          }
        }
      }
      
      // Unregister the service worker
      try {
        await registration.unregister();
      } catch (e) {
        console.warn('Failed to unregister service worker', e);
      }
    }
  } catch (error) {
    console.error('Error disabling notifications', error);
  }
}

import React, { createContext, useState, ReactNode, useEffect, useCallback } from "react";
import { useContext } from "react";
import { useAccount } from "./Account";
import { apiRequestService } from "../factories/apiRequestService";
import { config } from "../config";

type NotificationsContextType = {
  permission: NotificationPermission;
  setPermission: (val: NotificationPermission) => void;
  registered: boolean;
  setRegistered: (val: boolean) => void;
  upRegistered: boolean;
  setUPRegistered: (val: boolean) => void;
  upEndpoint: string | null;
  setUPEndpoint: (val: string | null) => void;
};

export const NotificationsContext = createContext<NotificationsContextType>({
  permission: 'default',
  setPermission: () => {},
  registered: false,
  setRegistered: () => {},
  upRegistered: false,
  setUPRegistered: () => {},
  upEndpoint: null,
  setUPEndpoint: () => {},
});

type NotificationsProviderProps = {
  children: ReactNode;
};

export const NotificationsProvider = ({
  children
}: NotificationsProviderProps) => {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [registered, setRegistered] = useState<boolean>(false)
  const [upRegistered, setUPRegistered] = useState<boolean>(false)
  const [upEndpoint, setUPEndpoint] = useState<string | null>(null)
  const { loggedInAccount } = useAccount();

  // Handle foreground push notifications
  const handleForegroundPush = useCallback((event: MessageEvent) => {
    if (event.data?.type === 'PUSH_NOTIFICATION') {
      const data = event.data.payload;
      const title = data.title || 'Notification';
      const body = data.body || '';
      const icon = data.icon;
      const link = data.link || '/';

      if (Notification.permission === 'granted' && title) {
        const notification = new Notification(title, {
          body,
          icon,
          data: { url: link },
        });

        notification.onclick = (e) => {
          e.preventDefault();
          notification.close();
          if (link && link !== '/') {
            window.open(link, '_blank');
          } else {
            window.focus();
          }
        };
      }
    }
  }, []);

  useEffect(() => {
    if (!loggedInAccount) {
      return;
    }
    
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    // Only check subscriptions if the account has notification channels
    const hasNotificationChannels = loggedInAccount?.account_notification_channels
      && loggedInAccount?.account_notification_channels?.length > 0;
    if (!hasNotificationChannels) {
      return;
    }

    const vapidPublicKey = config.public.notifications.webpush.vapidPublicKey;

    const init = async () => {
      const p = Notification.permission;
      setPermission(p);

      // Check Web Push devices
      if (p === 'granted' && vapidPublicKey) {
        try {
          const devices = await apiRequestService.reqAccountWebPushDeviceGetAllForAccount();

          if (devices.length === 0) {
            setRegistered(false);
          } else {
            // Check if we have a current push subscription
            const registration = await navigator.serviceWorker.getRegistration('/webpush-sw.js');
            if (registration) {
              const subscription = await registration.pushManager.getSubscription();
              if (subscription) {
                const endpoint = subscription.endpoint;
                // Check if our current subscription endpoint matches any device
                const match = devices.find(d => d.endpoint === endpoint);
                if (match) {
                  setRegistered(true);
                } else {
                  setRegistered(false);
                }
              } else {
                setRegistered(false);
              }
            } else {
              setRegistered(false);
            }
          }
        } catch (e) {
          console.warn('Could not fetch Web Push devices to determine registration', e);
          setRegistered(false);
        }
      }

      // Check UP devices
      try {
        const upDevices = await apiRequestService.reqAccountUPDeviceGetAllForAccount();
        if (upDevices.length > 0) {
          setUPRegistered(true);
          setUPEndpoint(upDevices[0].up_endpoint);
        } else {
          setUPRegistered(false);
          setUPEndpoint(null);
        }
      } catch (e) {
        console.warn('Could not fetch UP devices to determine registration', e);
        setUPRegistered(false);
        setUPEndpoint(null);
      }
    };

    init();

    // Set up listener for foreground push messages from service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleForegroundPush);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleForegroundPush);
      }
    };
  }, [loggedInAccount, handleForegroundPush]);

  return (
    <NotificationsContext.Provider
      value={{
        permission, setPermission,
        registered, setRegistered,
        upRegistered, setUPRegistered,
        upEndpoint, setUPEndpoint
      }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within a NotificationsProvider");
  return ctx;
}

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useContext } from "react";
import { useLocale } from "next-intl";
import { useAccount } from "./Account";
import { apiRequestService } from "../factories/apiRequestService";
import { getToken, messaging } from "../external-services/firebase/init";
import { getOrCreateInstallationId } from "../external-services/firebase/installationIdKey";

type NotificationsContextType = {
  permission: NotificationPermission;
  setPermission: (val: NotificationPermission) => void;
  registered: boolean;
  setRegistered: (val: boolean) => void;
};

export const NotificationsContext = createContext<NotificationsContextType>({
  permission: 'default',
  setPermission: () => {},
  registered: false,
  setRegistered: () => {},
});

type NotificationsProviderProps = {
  children: ReactNode;
};

export const NotificationsProvider = ({
  children
}: NotificationsProviderProps) => {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [registered, setRegistered] = useState<boolean>(false)
  const { loggedInAccount } = useAccount();
  const locale = useLocale();

  useEffect(() => {
    if (!loggedInAccount) {
      return;
    }
    
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    const init = async () => {
      const p = Notification.permission;
      setPermission(p);

      if (p === 'granted') {
        let token: string | null = null;
        
        const devices = await apiRequestService.reqAccountFCMDeviceGetAllForAccount();

        if (devices.length === 0) {
          setRegistered(false);
          return;
        }

        try {
          const registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
          token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration || undefined,
          });
          if (token) {
            const installation_id = getOrCreateInstallationId();
            if (installation_id) {
              const match = devices.find(d => d.fcm_token === token && d.installation_id === installation_id);
              if (match) {
                setRegistered(true);
                return;
              } else {
                const match2 = devices.find(d => d.fcm_token === token && d.installation_id !== installation_id);
                if (match2) {
                  await apiRequestService.reqAccountFCMDeviceUpdate({
                    previous_fcm_token: token,
                    new_fcm_token: token,
                    installation_id,
                    platform: 'web',
                    locale
                  });
                  setRegistered(true);
                  return;
                } else {
                  const match3 = devices.find(d => d.installation_id === installation_id);
                  if (match3) {
                    await apiRequestService.reqAccountFCMDeviceUpdate({
                      previous_fcm_token: match3.fcm_token,
                      new_fcm_token: token,
                      installation_id,
                      platform: 'web',
                      locale
                    });
                    setRegistered(true);
                    return;
                  }
                }
              }
            }
            setRegistered(false);
          }
        } catch (e) {
          console.warn('Could not fetch devices to determine registration', e);
          setRegistered(false);
        }
      }
    }

    init();
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        permission, setPermission,
        registered, setRegistered
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

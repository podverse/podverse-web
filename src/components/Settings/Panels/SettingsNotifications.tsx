"use client"

import React from 'react'
import { useTranslations } from 'next-intl'
import { requestNotificationPermission } from '../../../external-services/firebase/requestNotificationPermission'
import { disableNotificationPermission } from '../../../external-services/firebase/disableNotificationPermission'
import { getToken, messaging } from '../../../external-services/firebase/init'
import { apiRequestService } from '../../../factories/apiRequestService'
import { useNotifications } from '../../../contexts/Notifications'
import { useAccount } from '../../../contexts/Account'
import { useModals } from '../../../contexts/Modals'
import { SwitchButton } from '../../Form/SwitchButton'
import { useLoadingMap } from '../../../hooks/useLoadingMap'
import { Divider } from '../../Divider/Divider'

export function SettingsNotifications() {
  const { setPermission, registered, setRegistered } = useNotifications();
  const { loadingMap, withLoading, setLoadingFor } = useLoadingMap();
  const { loggedInAccount, setLoggedInAccount } = useAccount();
  const { setModalLoginRequired } = useModals();
  const tInstructions = useTranslations("instructions");
  const tSettings = useTranslations("settings");

  const enableNotifications = async () => {
    setLoadingFor('notifications', true);
    if (!loggedInAccount) {
      setModalLoginRequired({
        title: null,
        message: tInstructions("login_to_enable_notifications")
      })
      setLoadingFor('notifications', false);
      return;
    }
    
    try {
      await withLoading('notifications', async () => {
        await requestNotificationPermission()
      })
    } finally {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        const p = Notification.permission;
        setPermission(p);

        if (p === 'granted') {
          try {
            const registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
            const token = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
              serviceWorkerRegistration: registration || undefined,
            });
            try {
              const devices = await apiRequestService.reqAccountFCMDeviceGetAllForAccount();
              const match = token ? devices.find(d => d.fcm_token === token) : null;
              setRegistered(!!match);
            } catch (e) {
              console.warn('Could not fetch devices to verify registration', e);
              setRegistered(false);
            }
          } catch (e) {
            console.warn('Could not read FCM token after enable', e);
            setRegistered(false);
          }
        } else {
          setRegistered(false);
        }
      }
    }
  }

  const disableNotifications = async () => {
    setLoadingFor('notifications', true);
    if (!loggedInAccount) {
      setModalLoginRequired({
        title: null,
        message: tInstructions("login_to_disable_notifications")
      })
      setLoadingFor('notifications', false);
      return;
    }
    await withLoading('notifications', async () => {
      await disableNotificationPermission();
      if (typeof window !== 'undefined' && 'Notification' in window) {
        const p = Notification.permission;
        setPermission(p);
      } else {
        setPermission('default');
      }
      setRegistered(false);
    })
  }

  // Default notification types switches
  const defaultTypes = [
    { key: 'new-item', label: tSettings('notifications.default_new_item') },
    { key: 'livestream-scheduled', label: tSettings('notifications.default_livestream_scheduled') },
    { key: 'livestream-started', label: tSettings('notifications.default_livestream_started') },
  ];

  const toggleDefaultType = async (type: string, next: boolean) => {
    setLoadingFor(`notifications.${type}`, true);
    if (!loggedInAccount) {
      setModalLoginRequired({ title: null, message: tInstructions(next ? 'login_to_enable_notifications' : 'login_to_disable_notifications') });
      setLoadingFor(`notifications.${type}`, false);
      return;
    }

    await withLoading(`notifications.${type}`, async () => {
      try {
        if (next) {
          const updated = await apiRequestService.reqAccountSettingsNotificationTypeCreate({ type });
          setLoggedInAccount(updated as any);
        } else {
          const updated = await apiRequestService.reqAccountSettingsNotificationTypeDelete({ type });
          setLoggedInAccount(updated as any);
        }
      } catch (e) {
        console.warn('Could not toggle notification type', type, e);
      }
    });

    setLoadingFor(`notifications.${type}`, false);
  }

  return (
    <>
      <SwitchButton
        id="notifications"
        label={tSettings("notifications.show_app_notifications")}
        checked={registered}
        onChange={async (next) => {
          if (next) {
            await enableNotifications();
          } else {
            await disableNotifications();
          }
        }}
        loading={!!loadingMap['notifications']}
        aria-describedby="notifications-help"
      />
      <Divider />
      {defaultTypes.map(dt => (
        <SwitchButton
          key={dt.key}
          id={`notifications-${dt.key}`}
          label={dt.label}
          checked={
            registered
            && !!loggedInAccount?.account_settings?.account_settings_notification?.account_settings_notification_types?.find(t => t.type === dt.key)
          }
          onChange={async (next) => await toggleDefaultType(dt.key, next)}
          loading={!!loadingMap[`notifications.${dt.key}`]}
          aria-describedby={`notifications-help-${dt.key}`}
        />
      ))}
    </>
  )
}

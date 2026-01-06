import { useLocale, useTranslations } from "use-intl"
import { DTOChannel } from "podverse-helpers";
import { Button } from "../Button/Button";
import { useAccount } from "../../contexts/Account";
import { useModals } from "../../contexts/Modals";
import { apiRequestService } from "../../factories/apiRequestService";
import { handleRateLimitAlert } from "../../utils/rateLimit/rateLimitAlert";
import { SwitchButton } from "../Form/SwitchButton";
import { Divider } from "../Divider/Divider";
import { useLoadingMap } from "../../hooks/useLoadingMap";
import styles from "../../styles/components/List/ListChannelSettings.module.scss";

type ListChannelSettingsProps = {
  channel: DTOChannel;
}

export const ListChannelSettings = ({ channel }: ListChannelSettingsProps) => {
  const tInfo = useTranslations('info');
  const tSettings = useTranslations('settings');
  const tInstructions = useTranslations('instructions');
  const tMisc = useTranslations('misc');
  const { loggedInAccount, setLoggedInAccount } = useAccount();
  const { setModalLoginRequired } = useModals();
  const { loadingMap, withLoading, setLoadingFor } = useLoadingMap();
  const locale = useLocale();

  const checkFeedForUpdates = async () => {
    if (!loggedInAccount) {
      setModalLoginRequired({
        title: null,
        message: tInstructions("login_to_refresh_feeds")
      })
      return;
    }

    if (channel?.feed) {
      try {
        await apiRequestService.reqMQRSSRefreshOnDemand({
          url: channel.feed.url,
          podcast_index_id: channel.feed.podcast_index_id
        });
        alert(tSettings('feed.check_feed_added_to_queue'));
      } catch (error) {
        const rateLimitErrorHandled = handleRateLimitAlert(error, locale, tMisc);
        if (!rateLimitErrorHandled) {
          console.error(error);
          alert("Error performing action.");
        }
      }
    }
  }

  const notificationTypes = [
    { key: 'new-item', label: tSettings('notifications.new_item') },
    { key: 'livestream-scheduled', label: tSettings('notifications.livestream_scheduled') },
    { key: 'livestream-started', label: tSettings('notifications.livestream_started') },
  ];

  const getAccountNotificationChannel = () => {
    return loggedInAccount?.account_notification_channels?.find(
      (anc) => anc.channel_id === channel.id
    );
  };

  const isTypeEnabled = (type: string) => {
    const accountNotificationChannel = getAccountNotificationChannel();
    return !!accountNotificationChannel?.account_notification_channel_types?.find(
      (t) => t.type === type
    );
  };

  const toggleNotificationType = async (type: string, next: boolean) => {
    const loadingKey = `channel-notification.${type}`;
    setLoadingFor(loadingKey, true);

    if (!loggedInAccount) {
      setModalLoginRequired({
        title: null,
        message: tInstructions(next ? 'login_to_enable_notifications' : 'login_to_disable_notifications')
      });
      setLoadingFor(loadingKey, false);
      return;
    }

    const accountNotificationChannel = getAccountNotificationChannel();
    if (!accountNotificationChannel) {
      setLoadingFor(loadingKey, false);
      return;
    }

    await withLoading(loadingKey, async () => {
      try {
        if (next) {
          const updated = await apiRequestService.reqAccountNotificationChannelTypeCreate({
            channel_id_text: channel.id_text,
            type
          });
          setLoggedInAccount(updated as any);
        } else {
          const updated = await apiRequestService.reqAccountNotificationChannelTypeDelete({
            channel_id_text: channel.id_text,
            type
          });
          setLoggedInAccount(updated as any);
        }
      } catch (e) {
        console.warn('Could not toggle channel notification type', type, e);
      }
    });

    setLoadingFor(loadingKey, false);
  };

  const hasNotificationChannel = !!getAccountNotificationChannel();

  return (
    <div className={styles.wrapper}>
      <h3>{tInfo('rss_feed')}</h3>
      <Button
        variant="primary"
        onClick={checkFeedForUpdates}
      >
        {tSettings('feed.check_feed_for_updates')}
      </Button>
      {hasNotificationChannel && (
        <>
          <Divider />
          <h3>{tSettings('notifications.notifications')}</h3>
          {notificationTypes.map(nt => (
            <SwitchButton
              key={nt.key}
              id={`channel-notification-${nt.key}`}
              label={nt.label}
              checked={isTypeEnabled(nt.key)}
              onChange={async (next) => await toggleNotificationType(nt.key, next)}
              loading={!!loadingMap[`channel-notification.${nt.key}`]}
              aria-describedby={`channel-notification-help-${nt.key}`}
            />
          ))}
        </>
      )}
    </div>
  )
}
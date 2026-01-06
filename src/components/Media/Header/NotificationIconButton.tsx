"use client";

import { useTranslations } from "next-intl";
import { DTOChannel } from "podverse-helpers";
import { FaBell, FaBellSlash } from "react-icons/fa6";
import { useAccount } from "../../../contexts/Account";
import { useModals } from "../../../contexts/Modals";
import { IconButton } from "../Header/IconButton";
import { apiRequestService } from "../../../factories/apiRequestService";
import { requestNotificationPermission } from "../../../external-services/firebase/requestNotificationPermission";

type NotificationIconButtonProps = {
  channel: DTOChannel;
  kind: "podcast" | "artist" | "album" | "playlist";
}

export const NotificationIconButton: React.FC<NotificationIconButtonProps> = ({ channel, kind }) => {
  if ((kind === 'playlist')) {
    return null;
  }

  const tFeatures = useTranslations("features");
  const tInstructions = useTranslations("instructions");
  const { loggedInAccount, setLoggedInAccount } = useAccount();
  const { setModalLoginRequired } = useModals();
  
  const isSubscribed = loggedInAccount?.account_notification_channels?.some(
    account_notification_channel => account_notification_channel.channel_id === channel.id
  );

  const toggleNotification = async () => {
    if (!loggedInAccount) {
      setModalLoginRequired({
        title: null,
        message: tInstructions("login_to_enable_notifications")
      })
      return;
    }

    if (isSubscribed) {
      const updatedAccount = await apiRequestService.reqAccountNotificationChannelDelete({ channel_id_text: channel.id_text });
      await setLoggedInAccount(updatedAccount);
    } else {
      // Read permission into a fresh variable to avoid TypeScript narrowing issues
      const permissionBefore = (typeof Notification !== 'undefined') ? Notification.permission : undefined;

      if (permissionBefore !== 'granted') {
        // Request permission first
        await requestNotificationPermission();
      }

      // Re-read permission after the async call
      const permissionAfterRequest = (typeof Notification !== 'undefined') ? Notification.permission : undefined;
      if (permissionAfterRequest !== 'granted') {
        return;
      }

      const updatedAccount = await apiRequestService.reqAccountNotificationChannelCreate({ channel_id_text: channel.id_text });
      await setLoggedInAccount(updatedAccount);
    }
  }

  const iconNode = isSubscribed ? <FaBell /> : <FaBellSlash />;

  const label = isSubscribed
    ? tFeatures(`notifications.disable_notifications_for_this_${kind}`)
    : tFeatures(`notifications.enable_notifications_for_this_${kind}`);

  return (
    <IconButton
      type="button"
      onClick={() => toggleNotification()}
      ariaLabel={label}
      title={label}
      color="secondary"
      isGold={isSubscribed}
    >
      {iconNode}
    </IconButton>
  )
}

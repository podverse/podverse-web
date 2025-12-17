"use client";

import { useTranslations } from "next-intl";
import { DTOChannel } from "podverse-helpers";
import { FaBell, FaBellSlash } from "react-icons/fa6";
import { useAccount } from "../../../../contexts/Account";
import { useModals } from "../../../../contexts/Modals";
import { Link } from "../../../Link/Link";
import { apiRequestService } from "../../../../factories/apiRequestService";
import styles from "../../../styles/components/Media/Podcast/PodcastHeaderButtons.module.scss";

type AlbumHeaderNotificationButtonProps = {
  channel: DTOChannel;
}

export const AlbumHeaderNotificationButton: React.FC<AlbumHeaderNotificationButtonProps> = ({ channel }) => {
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
      const updatedAccount = await apiRequestService.reqAccountNotificationChannelCreate({ channel_id_text: channel.id_text });
      await setLoggedInAccount(updatedAccount);
    }
  }

  const iconNode = isSubscribed ? <FaBell /> : <FaBellSlash />;

  const label = isSubscribed
    ? tFeatures("notifications.disable_notifications_for_this_album")
    : tFeatures("notifications.enable_notifications_for_this_album");

  return (
    <Link
      type="button"
      onClick={() => toggleNotification()}
      className={styles.button}
      aria-label={label}
      title={label}
      color="secondary">
      {iconNode}
    </Link>
  )
}

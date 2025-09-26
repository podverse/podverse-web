"use client";

import { useTranslations } from "next-intl";
import { DTOChannel } from "podverse-helpers";
import { Button } from "../../../components/Button/Button"
import { useAccount } from "../../../contexts/Account";
import { apiRequestService } from "../../../factories/apiRequestService";
import styles from "../../../styles/components/Media/Podcast/PodcastHeaderSubscribeSection.module.scss";

type PodcastHeaderSubscribeSectionProps = {
  channel: DTOChannel;
}

export const PodcastHeaderSubscribeSection: React.FC<PodcastHeaderSubscribeSectionProps> = ({ channel }) => {
  const tFeatures = useTranslations("features");
  const { loggedInAccount, setLoggedInAccount } = useAccount();
  
  const isSubscribed = loggedInAccount?.account_following_channels?.some(
    account_following_channel => account_following_channel.channel_id === channel.id
  );

  const toggleSubscribe = async () => {
    if (isSubscribed) {
      const updatedAccount = await apiRequestService.reqAccountUnfollowChannel({ channel_id_text: channel.id_text });
      await setLoggedInAccount(updatedAccount);
    } else {
      const updatedAccount = await apiRequestService.reqAccountFollowChannel({ channel_id_text: channel.id_text });
      await setLoggedInAccount(updatedAccount);
    }
  }

  return (
    <Button
      className={styles.button}
      variant="miniGlow"
      onClick={toggleSubscribe}>
      {isSubscribed ? tFeatures("unsubscribe") : tFeatures("subscribe")}
    </Button>
  )
}

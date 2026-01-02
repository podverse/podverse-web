"use client";

import { useTranslations } from "next-intl";
import { DTOChannel } from "podverse-helpers";
import { Button } from "../../../Button/Button"
import { useAccount } from "../../../../contexts/Account";
import { apiRequestService } from "../../../../factories/apiRequestService";
import { useModals } from "../../../../contexts/Modals";
import styles from "../../../../styles/components/Media/Podcast/PodcastHeaderSubscribeButton.module.scss";

type ArtistHeaderSubscribeButtonProps = {
  channel: DTOChannel;
}

export const ArtistHeaderSubscribeButton: React.FC<ArtistHeaderSubscribeButtonProps> = ({ channel }) => {
  const tFeatures = useTranslations("features");
  const tInstructions = useTranslations("instructions");
  const { loggedInAccount, setLoggedInAccount } = useAccount();
  const { setModalLoginRequired } = useModals();
  
  const isSubscribed = loggedInAccount?.account_following_channels?.some(
    account_following_channel => account_following_channel.channel_id === channel.id
  );

  const toggleSubscribe = async () => {
    if (!loggedInAccount) {
      setModalLoginRequired({
        title: null,
        message: tInstructions("login_to_subscribe")
      })
      return;
    }

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

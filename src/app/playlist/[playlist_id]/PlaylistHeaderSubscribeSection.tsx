"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { DTOPlaylist } from "podverse-helpers";
import { Button } from "../../../components/Button/Button"
import { useAccount } from "../../../contexts/Account";
import { apiRequestService } from "../../../factories/apiRequestService";
import styles from "../../../styles/app/playlist/PlaylistHeaderSubscribeSection.module.scss";

type PlaylistHeaderSubscribeSectionProps = {
  playlist: DTOPlaylist;
}

export const PlaylistHeaderSubscribeSection: React.FC<PlaylistHeaderSubscribeSectionProps> = ({ playlist }) => {
  const router = useRouter();
  const tFeatures = useTranslations("features");
  const tMisc = useTranslations("misc");
  const { loggedInAccount, setLoggedInAccount } = useAccount();

  const isOwner = loggedInAccount?.id === playlist?.account?.id;

  const isSubscribed = loggedInAccount?.account_following_playlists?.some(
    account_following_playlist => account_following_playlist.playlist_id === playlist.id
  );

  const toggleSubscribe = async () => {
    if (isSubscribed) {
      const updatedAccount = await apiRequestService.reqAccountUnfollowPlaylist({ playlist_id_text: playlist.id_text });
      await setLoggedInAccount(updatedAccount);
    } else {
      const updatedAccount = await apiRequestService.reqAccountFollowPlaylist({ playlist_id_text: playlist.id_text });
      await setLoggedInAccount(updatedAccount);
    }
  }

  const editOnClick = () => {
    router.push(`/playlist/edit/${playlist.id_text}`);
  }

  return (
    <>
      {
        !isOwner && (
          <Button
            className={styles.button}
            variant="miniGlow"
            onClick={toggleSubscribe}>
            {isSubscribed ? tFeatures("unsubscribe") : tFeatures("subscribe")}
          </Button>
        )
      }
      {
        isOwner && (
          <Button
            className={styles.button}
            variant="miniGlowWarning"
            onClick={editOnClick}>
            {tMisc("edit")}
          </Button>
        )
      }
    </>
  )
}

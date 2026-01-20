"use client";

import { useTranslations } from "next-intl";
import { DTOAccount, DTOChannel, DTOPlaylist } from "podverse-helpers";
import React from "react";
import { Button } from "../../Button/Button";
import { useAccount } from "../../../contexts/Account";
import { useModals } from "../../../contexts/Modals";
import { apiRequestService } from "../../../factories/apiRequestService";
import styles from "../../../styles/components/Media/Header/SubscribeButton.module.scss";

type SubscribeButtonProps = {
  entity: DTOChannel | DTOPlaylist | DTOAccount;
  kind: "podcast" | "artist" | "album" | "playlist" | "profile";
  onEdit?: () => void;
}

export const SubscribeButton: React.FC<SubscribeButtonProps> = ({ entity, kind, onEdit }) => {
  const tFeatures = useTranslations("features");
  const tInstructions = useTranslations("instructions");
  const tMisc = useTranslations("misc");
  const { loggedInAccount, setLoggedInAccount } = useAccount();
  const { setModalLoginRequired } = useModals();

  if (kind === "podcast" || kind === "artist" || kind === "album") {
    const channel = entity as DTOChannel;
    const isSubscribed = loggedInAccount?.account_following_channels?.some(
      account_following_channel => account_following_channel.channel_id === channel.id
    );

    const toggleSubscribe = async () => {
      if (!loggedInAccount) {
        setModalLoginRequired({ title: null, message: tInstructions("login_to_subscribe") });
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
      <Button className={styles.button} variant="miniGlow" onClick={toggleSubscribe}>
        {isSubscribed ? tFeatures("unsubscribe") : tFeatures("subscribe")}
      </Button>
    )
  } else if (kind === "playlist") {
    const playlist = entity as DTOPlaylist;
    const isOwner = loggedInAccount?.id_text === playlist?.account?.id_text;
  
    const isSubscribedPlaylist = loggedInAccount?.account_following_playlists?.some(
      account_following_playlist => account_following_playlist.playlist_id === playlist.id
    );
  
    const toggleSubscribePlaylist = async () => {
      if (!loggedInAccount) {
        setModalLoginRequired({ title: null, message: tInstructions("login_to_subscribe") });
        return;
      }
  
      if (isSubscribedPlaylist) {
        const updatedAccount = await apiRequestService.reqAccountUnfollowPlaylist({ playlist_id_text: playlist.id_text });
        await setLoggedInAccount(updatedAccount);
      } else {
        const updatedAccount = await apiRequestService.reqAccountFollowPlaylist({ playlist_id_text: playlist.id_text });
        await setLoggedInAccount(updatedAccount);
      }
    }
  
    if (isOwner) {
      return (
        <Button className={styles.button} variant="miniGlowWarning" onClick={onEdit}>
          {tMisc("edit")}
        </Button>
      )
    }
  
    return (
      <Button className={styles.button} variant="miniGlow" onClick={toggleSubscribePlaylist}>
        {isSubscribedPlaylist ? tFeatures("unsubscribe") : tFeatures("subscribe")}
      </Button>
    )
  } else if (kind === "profile") {
    const account = entity as DTOAccount;
    const isOwner = loggedInAccount?.id_text === account?.id_text;

    const isFollowingAccount = loggedInAccount?.account_following_accounts?.some(
      account_following_account => account_following_account.following_account_id === account.id
    );

    const toggleFollowAccount = async () => {
      if (!loggedInAccount) {
        setModalLoginRequired({ title: null, message: tInstructions("login_to_subscribe") });
        return;
      }

      if (isFollowingAccount) {
        const updatedAccount = await apiRequestService.reqAccountUnfollowAccount({ following_account_id_text: account.id_text });
        await setLoggedInAccount(updatedAccount);
      } else {
        const updatedAccount = await apiRequestService.reqAccountFollowAccount({ following_account_id_text: account.id_text });
        await setLoggedInAccount(updatedAccount);
      }
    };

    if (isOwner) {
      return (
        <Button className={styles.button} variant="miniGlowWarning" onClick={onEdit}>
          {tMisc("edit")}
        </Button>
      )
    }

    return (
      <Button className={styles.button} variant="miniGlow" onClick={toggleFollowAccount}>
        {isFollowingAccount ? tFeatures("unsubscribe") : tFeatures("subscribe")}
      </Button>
    )
  }

  return null;
}

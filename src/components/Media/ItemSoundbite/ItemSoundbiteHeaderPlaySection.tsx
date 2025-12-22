"use client";

import { useTranslations } from "next-intl";
import { DTOChannel, DTOItem, DTOItemSoundbite, getQueueForMedium, getShuffleHash } from "podverse-helpers";
import React from "react";
import { PlayButtonLarge } from "../../MediaPlayer/Buttons/PlayButtonLarge";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { ReadableDate } from "../../Time/ReadableDate";
import { MoreButton } from "../../MoreButton/MoreButton";
import { showToastPromise, showToastPromiseWithLoading } from "../../Toast/Toast";
import { apiRequestService } from "../../../factories/apiRequestService";
import { useQueues } from "../../../contexts/Queue";
import { useModals } from "../../../contexts/Modals";
import { downloadAndSaveFile } from "../../../utils/fileDownloader";
import { useMediaPlayerResourceUpdate } from "../../../hooks/useMediaPlayerResourceUpdate";
import { getAutoQueueChannelMedium, useAutoQueue } from "../../../contexts/AutoQueue";
import { ReadableTimeRange } from "../../Time/ReadableTimeRange";
import { downloadEpisodeWithModal } from "../../../utils/downloadModal/downloadEpisodeWithModal";
import { useAccount } from "../../../contexts/Account";
import styles from "../../../styles/components/Media/ItemSoundbite/ItemSoundbiteHeaderPlaySection.module.scss";

type ItemSoundbiteHeaderPlaySectionProps = {
  channel: DTOChannel;
  item: DTOItem;
  item_soundbite: DTOItemSoundbite;
};

export const ItemSoundbiteHeaderPlaySection: React.FC<ItemSoundbiteHeaderPlaySectionProps> = ({ item_soundbite, item, channel }) => {
  const tFeatures = useTranslations("features");
  const tMediaPlayer = useTranslations("media_player");
  const tInstructions = useTranslations("instructions");
  const { queues } = useQueues();
  const { setModalPlaylistAddTo, setModalSourceSelector, setModalLoginRequired } = useModals();
  const { mpItemSoundbite, mpIsPlaying, setMPIsPlaying } = useMediaPlayer();
  const mediaPlayerResourceUpdate = useMediaPlayerResourceUpdate();
  const { loggedInAccount } = useAccount();
  const { autoQueueConfig } = useAutoQueue();

  const startTime = item_soundbite.start_time;
  const endTime = `${Number(item_soundbite.start_time) + Number(item_soundbite.duration)}`;
  
  const playButtonOnClick = () => {
    if (item_soundbite.id_text === mpItemSoundbite?.id_text) {
      setMPIsPlaying(!mpIsPlaying);
    } else {
      mediaPlayerResourceUpdate({
        shouldPlay: true,
        channel: channel,
        clip: null,
        item,
        itemChapter: null,
        itemChapterShouldSeek: false,
        itemSoundbite: item_soundbite,
        enclosureSelectedParams: 'use-active-item-or-default',
        isPlaying: true,
        skipMoveNowPlayingToHistory: false,
        newAutoQueueConfig: {
          aqmedium: getAutoQueueChannelMedium(channel),
          playlist_id_text: null,
          disabled: false,
          random: autoQueueConfig.random,
          repeat: autoQueueConfig.repeat,
          nextPage: 1,
          shuffleHash: getShuffleHash()
        },
        autoQueueShouldClear: true
      });
    }
  };

  const addToQueueNextOnClick = async () => {
    if (!loggedInAccount) {
      setModalLoginRequired({
        title: null,
        message: tInstructions("login_to_add_to_queue")
      })
      return;
    }

    const queue = getQueueForMedium(queues, channel.medium_id);
    if (queue) {
      showToastPromise(
        apiRequestService.reqQueueResourceItemSoundbiteAddNext(queue.id_text, item_soundbite.id_text),
        {
          success: tFeatures("queue.added_to_queue"),
          error: tFeatures("queue.add_error")
        }
      );
    }
  }

  const addToQueueLastOnClick = async () => {
    if (!loggedInAccount) {
      setModalLoginRequired({
        title: null,
        message: tInstructions("login_to_add_to_queue")
      })
      return;
    }

    const queue = getQueueForMedium(queues, channel.medium_id);
    if (queue) {
      showToastPromise(
        apiRequestService.reqQueueResourceItemSoundbiteAddLast(queue.id_text, item_soundbite.id_text),
        {
          success: tFeatures("queue.added_to_queue"),
          error: tFeatures("queue.add_error")
        }
      );
    }
  }

  const addToPlaylistOnClick = () => {
    if (!loggedInAccount) {
      setModalLoginRequired({
        title: null,
        message: tInstructions("login_to_add_to_playlist")
      })
      return;
    }

    setModalPlaylistAddTo({
      channel: channel,
      item: item,
      clip: null,
      item_soundbite: item_soundbite
    });
  }

  const markAsPlayedOnClick = async () => {
    if (!loggedInAccount) {
      setModalLoginRequired({
        title: null,
        message: tInstructions("login_to_mark_as_played")
      })
      return;
    }

    const queue = getQueueForMedium(queues, channel.medium_id);
    if (queue) {
      showToastPromise(
        apiRequestService.reqQueueResourceItemSoundbiteAddHistory(
          queue.id_text,
          item_soundbite.id_text, {
            completed: true
          }
        ),
        {
          success: tFeatures("history.marked_as_played"),
          error: tFeatures("history.mark_as_played_error")
        }
      );
    }
  }

  const downloadEpisode = async () => {
    downloadEpisodeWithModal({
      item,
      setModalSourceSelector,
      tFeatures,
      showToastPromiseWithLoading,
      downloadAndSaveFile
    });
  }

  const moreButtonMenuItems = [
    {
      label: tMediaPlayer("play"),
      onClick: playButtonOnClick
    },
    {
      label: tFeatures("queue.queue_next"),
      onClick: addToQueueNextOnClick
    },
    {
      label: tFeatures("queue.queue_last"),
      onClick: addToQueueLastOnClick
    },
    {
      label: tFeatures("playlist.add_to_playlist"),
      onClick: addToPlaylistOnClick
    },
    {
      label: tFeatures("history.mark_as_played"),
      onClick: markAsPlayedOnClick
    },
    {
      label: tFeatures("download.download_episode"),
      onClick: downloadEpisode
    }
  ]

  return (
    <div className={styles.playSection}>
      <div className={styles.sectionStart}>
        <PlayButtonLarge
          item_soundbite={item_soundbite}
          onClick={playButtonOnClick}
        />
        <div className={styles.timeSection}>
          <ReadableDate date={item.pub_date} />
          {item.item_about?.duration ? " • " : null}
          <ReadableTimeRange
            startTime={startTime}
            endTime={endTime}
          />
        </div>
      </div>
      <div className={styles.sectionEnd}>
        <MoreButton
          moreButtonMenuItems={moreButtonMenuItems}
          isLarge />
      </div>
    </div>
  )
};

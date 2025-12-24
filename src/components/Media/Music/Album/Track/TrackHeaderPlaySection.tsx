"use client";

import { DTOChannel, DTOItem, getQueueForMedium, getShuffleHash } from "podverse-helpers";
import React from "react";
import { useTranslations } from "next-intl";
import { PlayButtonLarge } from "../../../../MediaPlayer/Buttons/PlayButtonLarge";
import { useMediaPlayer } from "../../../../../contexts/MediaPlayer";
import { ReadableDate } from "../../../../Time/ReadableDate";
import { getDurationAndPositionStr, ReadableDuration } from "../../../../Time/ReadableDuration";
import { MoreButton } from "../../../../MoreButton/MoreButton";
import { showToastPromise, showToastPromiseWithLoading } from "../../../../Toast/Toast";
import { apiRequestService } from "../../../../../factories/apiRequestService";
import { useQueues } from "../../../../../contexts/Queue";
import { useModals } from "../../../../../contexts/Modals";
import { downloadAndSaveFile } from "../../../../../utils/fileDownloader";
import { useMediaPlayerResourceUpdate } from "../../../../../hooks/useMediaPlayerResourceUpdate";
import { useAutoQueue } from "../../../../../contexts/AutoQueue";
import { useQueueResourcesAbridgedIndex } from "../../../../../contexts/QueueResourcesAbridgedIndex";
import { useAccount } from "../../../../../contexts/Account";
import { downloadTrackWithModal } from "../../../../../utils/downloadModal/downloadTrackWithModal";
import styles from "../../../../../styles/components/Media/Podcast/Episode/EpisodeHeaderPlaySection.module.scss";

type TrackHeaderPlaySectionProps = {
  item: DTOItem;
  channel: DTOChannel;
};

export const TrackHeaderPlaySection: React.FC<TrackHeaderPlaySectionProps> = ({ item, channel }) => {
  const tFeatures = useTranslations("features");
  const tMediaPlayer = useTranslations("media_player");
  const tInstructions = useTranslations("instructions");
  const { queues } = useQueues();
  const { setModalPlaylistAddTo, setModalSourceSelector, setModalLoginRequired } = useModals();
  const { mpItem, mpIsPlaying, setMPIsPlaying } = useMediaPlayer();
  const mediaPlayerResourceUpdate = useMediaPlayerResourceUpdate();
  const { loggedInAccount } = useAccount();
  const { queueResourcesAbridgedIndex } = useQueueResourcesAbridgedIndex();
  const { durationStr } = getDurationAndPositionStr(item, queueResourcesAbridgedIndex);
  const positionStr = null;
  const { autoQueueConfig } = useAutoQueue();
  
  const playButtonOnClick = () => {
    if (item.id === mpItem?.id) {
      setMPIsPlaying(!mpIsPlaying);
    } else {
      mediaPlayerResourceUpdate({
        shouldPlay: true,
        channel: channel,
        clip: null,
        item: item,
        itemChapter: null,
        itemChapterShouldSeek: false,
        itemSoundbite: null,
        isPlaying: true,
        enclosureSelectedParams: 'use-active-item-or-default',
        skipMoveNowPlayingToHistory: false,
        newAutoQueueConfig: {
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
        apiRequestService.reqQueueResourceItemAddNext(queue.id_text, item.id_text),
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
        apiRequestService.reqQueueResourceItemAddLast(queue.id_text, item.id_text),
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
      item_soundbite: null
    });
  }

  const downloadTrack = async () => {
    downloadTrackWithModal({
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
      label: tFeatures("download.download_track"),
      onClick: downloadTrack
    }
  ]

  return (
    <div className={styles.playSection}>
      <div className={styles.sectionStart}>
        <PlayButtonLarge
          item={item}
          onClick={playButtonOnClick}
        />
        <div className={styles.timeSection}>
          <ReadableDate date={item.pub_date} />
          {item.item_about?.duration ? " • " : null}
          <ReadableDuration
            durationStr={durationStr}
            positionStr={positionStr}
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

"use client";

import { useTranslations } from "next-intl";
import { DTOChannel, DTOClip, DTOItem, getQueueForMedium } from "podverse-helpers";
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
import { getAutoQueueChannelMedium } from "../../../contexts/AutoQueue";
import { ReadableTimeRange } from "../../Time/ReadableTimeRange";
import { downloadEpisodeWithModal } from "../../../utils/downloadModal/downloadEpisodeWithModal";
import styles from "../../../styles/components/Media/Clip/ClipHeaderPlaySection.module.scss";
import { useAccount } from "../../../contexts/Account";

type ClipHeaderPlaySectionProps = {
  clip: DTOClip;
  item: DTOItem;
  channel: DTOChannel;
};

export const ClipHeaderPlaySection: React.FC<ClipHeaderPlaySectionProps> = ({ clip, item, channel }) => {
  const tFeatures = useTranslations("features");
  const tMediaPlayer = useTranslations("media_player");
  const tInstructions = useTranslations("instructions");
  const { queues } = useQueues();
  const { setModalPlaylistAddTo, setModalSourceSelector, setModalLoginRequired } = useModals();
  const { loggedInAccount } = useAccount();
  const { mpClip, mpIsPlaying, setMPIsPlaying } = useMediaPlayer();
  const mediaPlayerResourceUpdate = useMediaPlayerResourceUpdate();
  
  const playButtonOnClick = () => {
    if (clip.id_text === mpClip?.id_text) {
      setMPIsPlaying(!mpIsPlaying);
    } else {
      mediaPlayerResourceUpdate({
        shouldPlay: true,
        channel: channel,
        clip,
        item,
        itemChapter: null,
        itemChapterShouldSeek: false,
        itemSoundbite: null,
        enclosureSelectedParams: 'use-active-item-or-default',
        isPlaying: true,
        skipMoveNowPlayingToHistory: false,
        newAutoQueueConfig: {
          aqmedium: getAutoQueueChannelMedium(channel),
          playlist_id_text: null
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
        apiRequestService.reqQueueResourceClipAddNext(queue.id_text, clip.id_text),
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
        apiRequestService.reqQueueResourceClipAddLast(queue.id_text, clip.id_text),
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
      clip: clip,
      item_soundbite: null
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
        apiRequestService.reqQueueResourceClipAddHistory(
          queue.id_text,
          clip.id_text, {
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
          clip={clip}
          onClick={playButtonOnClick}
        />
        <div className={styles.timeSection}>
          <ReadableDate date={item.pub_date} />
          {item.item_about?.duration ? " • " : null}
          <ReadableTimeRange
            startTime={clip.start_time}
            endTime={clip.end_time}
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

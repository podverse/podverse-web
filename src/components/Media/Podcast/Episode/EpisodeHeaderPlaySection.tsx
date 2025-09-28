"use client";

import { DTOChannel, DTOItem, getSelectedItemEnclosureUrl } from "podverse-helpers";
import React from "react";
import { PlayButtonLarge } from "../../../MediaPlayer/Buttons/PlayButtonLarge";
import { useMediaPlayer } from "../../../../contexts/MediaPlayer";
import styles from "../../../../styles/components/Media/Podcast/Episode/EpisodeHeaderPlaySection.module.scss";
import { ReadableDate } from "../../../Time/ReadableDate";
import { ReadableDuration } from "../../../Time/ReadableDuration";
import { MoreButton } from "../../../MoreButton/MoreButton";
import { useTranslations } from "next-intl";
import { showToastPromise, showToastPromiseWithLoading } from "../../../Toast/Toast";
import { getQueueForMedium } from "../../../../utils/queue";
import { apiRequestService } from "../../../../factories/apiRequestService";
import { useQueues } from "../../../../contexts/Queue";
import { useModals } from "../../../../contexts/Modals";
import { downloadAndSaveFile } from "../../../../utils/fileDownloader";

type EpisodeHeaderPlaySectionProps = {
  item: DTOItem;
  channel: DTOChannel;
};

export const EpisodeHeaderPlaySection: React.FC<EpisodeHeaderPlaySectionProps> = ({ item, channel }) => {
  const tFeatures = useTranslations("features");
  const tMediaPlayer = useTranslations("media_player");
  const { queues } = useQueues();
  const { setModalPlaylistAddTo } = useModals();
  const { setMPChannel, mpItem, setMPItem, setMPClip, mpIsPlaying,
    setMPIsPlaying } = useMediaPlayer();
  
  const playButtonOnClick = () => {
    if (item.id === mpItem?.id) {
      setMPIsPlaying(!mpIsPlaying);
    } else {
      setMPChannel(channel);
      setMPItem(item);
      setMPClip(null);
      setMPIsPlaying(true);
    }
  };

  const addToQueueNextOnClick = async () => {
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
    setModalPlaylistAddTo({
      channel: channel,
      item: item,
      clip: null,
      item_chapter: null,
      item_soundbite: null
    });
  }

  const markAsPlayedOnClick = async () => {
    const queue = getQueueForMedium(queues, channel.medium_id);
    if (queue) {
      showToastPromise(
        apiRequestService.reqQueueResourceItemAddHistory(
          queue.id_text,
          item.id_text, {
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
    const selectedItemEnclosureUrl = getSelectedItemEnclosureUrl(item.item_enclosures);
    if (selectedItemEnclosureUrl) {
      showToastPromiseWithLoading(
        downloadAndSaveFile(selectedItemEnclosureUrl, item.title || 'episode.mp3'),
        {
          loading: tFeatures("download.downloading_episode"),
          success: tFeatures("download.episode_downloaded"),
          error: tFeatures("download.download_error")
        }
      )
    }
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
          item={item}
          onClick={playButtonOnClick}
        />
        <div className={styles.timeSection}>
          <ReadableDate date={item.pub_date} />
          {item.item_about?.duration ? " • " : null}
          <ReadableDuration durationInSeconds={item.item_about.duration || null} />
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

"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { DTOChannel, DTOItem, findDTOChannelImageBySize, findDTOItemImageBySize,
  stripAndDecodeHtml } from "podverse-helpers";
import React from "react";
import { FaGripLines } from "react-icons/fa6";
import { Image } from "../../../Image/Image";
import { ROUTES } from "../../../../constants/routes";
import { IMAGES } from "../../../../constants/images";
import { PlayButtonRow } from "../../../MediaPlayer/Buttons/PlayButtonRow";
import { getDurationAndPositionStr, ReadableDuration } from "../../../Time/ReadableDuration";
import { MoreButton, MoreButtonMenuItem } from "../../../MoreButton/MoreButton";
import { useMediaPlayer } from "../../../../contexts/MediaPlayer";
import { ReadableDate } from "../../../Time/ReadableDate";
import { useModals } from "../../../../contexts/Modals";
import { getQueueForMedium } from "../../../../utils/queue";
import { useQueues } from "../../../../contexts/Queue";
import { apiRequestService } from "../../../../factories/apiRequestService";
import { showToastPromise, showToastPromiseWithLoading } from "../../../Toast/Toast";
import { downloadAndSaveFile } from "../../../../utils/fileDownloader";
import { useMediaPlayerResourceUpdate } from "../../../../hooks/useMediaPlayerResourceUpdate";
import { useQueueResourcesAbridgedIndex } from "../../../../contexts/QueueResourcesAbridgedIndex";
import { getAutoQueueChannelMedium } from "../../../../contexts/AutoQueue";
import { downloadEpisodeWithModal } from "../../../../utils/downloadEpisodeWithModal";
import styles from "../../../../styles/components/List/Podcasts/Episodes/ListEpisodeRow.module.scss";

interface Props {
  channel: DTOChannel;
  item: DTOItem;
  showChannelInfo?: boolean;
  isEditModeQueue?: boolean;
  removeFromQueue?: () => void;
  isEditModePlaylist?: boolean;
  removeFromPlaylist?: () => void;
  playlist_id_text?: string;
}

const ListEpisodeRow: React.FC<Props> = ({ channel, isEditModeQueue, item,
  showChannelInfo, removeFromQueue, isEditModePlaylist, removeFromPlaylist,
  playlist_id_text }) => {
  const url = `${ROUTES.EPISODE}/${item.id_text}`;
  const channel_image = findDTOChannelImageBySize(channel.channel_images, IMAGES.LIST.EPISODES.DESKTOP.SIZE_FIND_TARGET, 'lesser');
  const item_image = findDTOItemImageBySize(item.item_images, IMAGES.LIST.EPISODES.DESKTOP.SIZE_FIND_TARGET, 'lesser');
  const tFeatures = useTranslations("features");
  const tMedia = useTranslations("media");
  const tMediaPlayer = useTranslations("media_player");
  const { queues } = useQueues();
  const { mpItem, mpIsPlaying, setMPIsPlaying } = useMediaPlayer();
  const mediaPlayerResourceUpdate = useMediaPlayerResourceUpdate();
  const { setModalPlaylistAddTo, setModalSourceSelector } = useModals();
  const { queueResourcesAbridgedIndex } = useQueueResourcesAbridgedIndex();
  const { durationStr, positionStr } = getDurationAndPositionStr(item, queueResourcesAbridgedIndex);

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
        enclosureSelectedParams: 'use-active-item-or-default',
        isPlaying: true,
        skipMoveNowPlayingToHistory: false,
        newAutoQueueConfig: {
          aqmedium: getAutoQueueChannelMedium(channel, playlist_id_text),
          playlist_id_text: playlist_id_text || null
        },
        autoQueueShouldClear: true
      });
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
    downloadEpisodeWithModal({
      item,
      setModalSourceSelector,
      tFeatures,
      showToastPromiseWithLoading,
      downloadAndSaveFile
    });
  }

  const removeFromQueueOnClick = async () => {
    const queue = getQueueForMedium(queues, channel.medium_id);

    async function handler () {
      if (queue) {
        await apiRequestService.reqQueueResourceItemDelete(queue.id_text, item.id_text);
        removeFromQueue?.();
      }
    }

    showToastPromise(
      handler,
      {
        success: tFeatures("queue.removed_from_queue"),
        error: tFeatures("queue.remove_error")
      }
    );
  }

  const removeFromPlaylistOnClick = async () => {
    async function handler () {
      if (playlist_id_text) {
        await apiRequestService.reqPlaylistResourceItemDelete(playlist_id_text, item.id_text);
        removeFromPlaylist?.();
      }
    }

    showToastPromise(
      handler,
      {
        success: tFeatures("playlist.removed_from_playlist"),
        error: tFeatures("playlist.remove_error")
      }
    );
  }

  const moreButtonMenuItems: MoreButtonMenuItem[] = [
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

  if (isEditModeQueue) {
    moreButtonMenuItems.push({
      label: tFeatures("queue.remove_from_queue"),
      onClick: removeFromQueueOnClick,
      variant: "danger"
    });
  }

  if (isEditModePlaylist) {
    moreButtonMenuItems.push({
      label: tFeatures("playlist.remove_from_playlist"),
      onClick: removeFromPlaylistOnClick,
      variant: "danger"
    });
  }

  return (
    <div className={styles.row}>
      {
        (isEditModeQueue || isEditModePlaylist) && (
          <div className={styles.editingButtons}>
            <FaGripLines />
          </div>
        )
      }
      <Link href={url} tabIndex={-1}>
        <Image 
          src={item_image?.url || channel_image?.url}
          alt={item.title || tMedia("podcast.episode_image")}
          width={IMAGES.LIST.EPISODES.DESKTOP.SIZE}
          height={IMAGES.LIST.EPISODES.DESKTOP.SIZE}
          className={styles.image}
        />
        <Image 
          src={item_image?.url || channel_image?.url}
          alt={item.title || tMedia("podcast.episode_image")}
          width={IMAGES.LIST.EPISODES.MOBILE.SIZE}
          height={IMAGES.LIST.EPISODES.MOBILE.SIZE}
          className={styles.imageMobile}
        />
      </Link>
      <div className={styles.content}>
        <Link href={url}>
          <div className={styles.topSection}>
            <h3>{item.title}</h3>
              <div className={styles.subtitle}>
                {
                  !showChannelInfo && stripAndDecodeHtml(item.item_description?.value)
                }
                {
                  showChannelInfo && channel.title
                }
              </div>
          </div>
        </Link>
        <div className={styles.bottomSection}>
          <div className={styles.bottomSectionStart}>
            <PlayButtonRow
              item={item}
              onClick={playButtonOnClick}
            />
            <div className={styles.timeSection}>
              <ReadableDate date={item.pub_date} />
              {durationStr ? " • " : null}
              <ReadableDuration
                durationStr={durationStr}
                positionStr={positionStr}
              />
            </div>
          </div>
          <div className={styles.bottomSectionEnd}>
            <MoreButton moreButtonMenuItems={moreButtonMenuItems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListEpisodeRow;

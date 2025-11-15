"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { DTOChannel, DTOItem, DTOItemSoundbite, findDTOChannelImageBySize, findDTOItemImageBySize } from "podverse-helpers";
import React from "react";
import { FaGripLines } from "react-icons/fa6";
import { Image } from "../../Image/Image";
import { ROUTES } from "../../../constants/routes";
import { IMAGES } from "../../../constants/images";
import { PlayButtonRow } from "../../MediaPlayer/Buttons/PlayButtonRow";
import { MoreButton, MoreButtonMenuItem } from "../../MoreButton/MoreButton";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { ReadableDate } from "../../Time/ReadableDate";
import { ReadableTimeRange } from "../../Time/ReadableTimeRange";
import { getQueueForMedium } from "../../../utils/queue";
import { useQueues } from "../../../contexts/Queue";
import { showToastPromise } from "../../Toast/Toast";
import { apiRequestService } from "../../../factories/apiRequestService";
import { useModals } from "../../../contexts/Modals";
import { useMediaPlayerResourceUpdate } from "../../../hooks/useMediaPlayerResourceUpdate";
import { getAutoQueueChannelMedium } from "../../../contexts/AutoQueue";
import styles from "../../../styles/components/List/ItemSoundbites/ListItemSoundbiteRow.module.scss";

interface ListItemSoundbiteProps {
  channel: DTOChannel | null;
  item: DTOItem | null;
  item_soundbite: DTOItemSoundbite;
  showItemInfo?: boolean;
  showChannelInfo?: boolean;
  isEditModeQueue?: boolean;
  removeFromQueue?: () => void;
  isEditModePlaylist?: boolean;
  removeFromPlaylist?: () => void;
  playlist_id_text?: string;
}

export const ListItemSoundbiteRow: React.FC<ListItemSoundbiteProps> = ({
  channel,
  item,
  item_soundbite,
  showItemInfo,
  showChannelInfo,
  isEditModeQueue,
  removeFromQueue,
  isEditModePlaylist,
  removeFromPlaylist,
  playlist_id_text
}) => {
  const url = `${ROUTES.OFFICIAL_CLIP}/${item_soundbite.id_text}`;

  channel = item?.channel || channel || null;
  item = item_soundbite.item || item || null;

  const channel_images = channel?.channel_images;
  const item_images = item?.item_images;

  const channel_image = findDTOChannelImageBySize(channel_images, IMAGES.LIST.CLIPS.SIZE_FIND_TARGET, 'lesser');
  const item_image = findDTOItemImageBySize(item_images, IMAGES.LIST.CLIPS.SIZE_FIND_TARGET, 'lesser');

  const tFeatures = useTranslations("features");
  const tMedia = useTranslations("media");
  const tMediaPlayer = useTranslations("media_player");
  const tMisc = useTranslations("misc");
  const { mpItemSoundbite,mpIsPlaying, setMPIsPlaying } = useMediaPlayer();
  const mediaPlayerResourceUpdate = useMediaPlayerResourceUpdate();
  const { setModalPlaylistAddTo } = useModals();
  const { queues } = useQueues();

  const itemSoundbiteTitle = item_soundbite.title || tMisc("untitled");
  const channelTitle = channel?.title || tMisc("untitled");
  const itemTitle = item?.title || tMisc("untitled");
  const itemPubDate = item?.pub_date;
  const startTime = item_soundbite.start_time;
  const endTime = `${Number(item_soundbite.start_time) + Number(item_soundbite.duration)}`;

  const playButtonOnClick = () => {
    if (item_soundbite.id === mpItemSoundbite?.id) {
      setMPIsPlaying(!mpIsPlaying);
    } else {
      mediaPlayerResourceUpdate({
        shouldPlay: true,
        channel: channel,
        clip: null,
        item: item,
        itemChapter: null,
        itemChapterShouldSeek: false,
        itemSoundbite: item_soundbite,
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
    if (channel) {
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
  }

  const addToQueueLastOnClick = async () => {
    if (channel) {
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
  };

  const addToPlaylistOnClick = () => {
    setModalPlaylistAddTo({
      channel: channel,
      item: item || item_soundbite.item || null,
      clip: null,
      item_soundbite
    });
  }

  const moreButtonMenuItems: MoreButtonMenuItem[] = [
    {
      label: tMediaPlayer("play"),
      onClick: () => alert(tMediaPlayer("play"))
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
    }
  ];

  const removeFromQueueOnClick = async () => {
    if (channel) {
      const queue = getQueueForMedium(queues, channel.medium_id);
      async function handler() {
        if (queue) {
          await apiRequestService.reqQueueResourceItemSoundbiteDelete(queue.id_text, item_soundbite.id_text);
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
  };

  const removeFromPlaylistOnClick = async () => {
    async function handler () {
      if (playlist_id_text) {
        await apiRequestService.reqPlaylistResourceItemSoundbiteDelete(playlist_id_text, item_soundbite.id_text);
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
  };

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
          alt={itemTitle || tMedia("podcast.episode_image")}
          width={IMAGES.LIST.CLIPS.SIZE}
          height={IMAGES.LIST.CLIPS.SIZE}
          className={styles.image}
        />
        <Image 
          src={item_image?.url || channel_image?.url}
          alt={itemTitle || tMedia("podcast.episode_image")}
          width={IMAGES.LIST.CLIPS.SIZE}
          height={IMAGES.LIST.CLIPS.SIZE}
          className={styles.imageMobile}
        />
      </Link>
      <div className={styles.content}>
        <Link href={url}>
          <div className={styles.topSection}>
            <h3 className={styles.clipTitle}>{itemSoundbiteTitle}</h3>
            {(showChannelInfo || showItemInfo) && (
              <div className={styles.subtitle}>
                {showChannelInfo && channelTitle}
                {showChannelInfo && showItemInfo && " • "}
                {showItemInfo && itemTitle}
              </div>
            )}
          </div>
        </Link>
        <div className={styles.bottomSection}>
          <div className={styles.bottomSectionStart}>
            <PlayButtonRow
              item_soundbite={item_soundbite}
              item={item || item_soundbite.item || null}
              onClick={playButtonOnClick}
            />
            <div className={styles.timeSection}>
              {
                showItemInfo && (
                  <>
                    <ReadableDate date={itemPubDate} />
                    {" • "}
                  </>
                )
              }
              <ReadableTimeRange
                startTime={startTime}
                endTime={endTime} />
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

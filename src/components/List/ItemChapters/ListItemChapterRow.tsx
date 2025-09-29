"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { DTOChannel, DTOItem, DTOItemChapter, findDTOChannelImageBySize, findDTOItemImageBySize } from "podverse-helpers";
import React from "react";
import Image from "../../Image/Image";
import { ROUTES } from "../../../constants/routes";
import { IMAGES } from "../../../constants/images";
import { PlayButtonRow } from "../../MediaPlayer/Buttons/PlayButtonRow";
import { MoreButton } from "../../MoreButton/MoreButton";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { ReadableTimeRange } from "../../Time/ReadableTimeRange";
import { getQueueForMedium } from "../../../utils/queue";
import { useQueues } from "../../../contexts/Queue";
import { showToastPromise } from "../../Toast/Toast";
import { apiRequestService } from "../../../factories/apiRequestService";
import { useModals } from "../../../contexts/Modals";
import styles from "../../../styles/components/List/ItemChapters/ListItemChapterRow.module.scss";

interface ListItemChapterRowProps {
  channel: DTOChannel | null;
  item: DTOItem | null;
  item_chapter: DTOItemChapter;
}

export const ListItemChapterRow: React.FC<ListItemChapterRowProps> = (
  { channel, item, item_chapter }) => {
  const url = `${ROUTES.CHAPTER}/${item_chapter.id_text}`;

  channel = item?.channel || channel || null;

  const channel_images = channel?.channel_images;
  const item_images = item?.item_images;

  const channel_image = findDTOChannelImageBySize(channel_images, IMAGES.LIST.CLIPS.SIZE_FIND_TARGET, 'lesser');
  const item_image = findDTOItemImageBySize(item_images, IMAGES.LIST.CLIPS.SIZE_FIND_TARGET, 'lesser');

  const tFeatures = useTranslations("features");
  const tMediaPlayer = useTranslations("media_player");
  const tMisc = useTranslations("misc");
  const tInfo = useTranslations("info");
  const { setMPChannel, mpItemChapter, setMPItem, setMPClip, mpIsPlaying,
    setMPIsPlaying, setMPItemSoundbite, setMPItemChapter,
    setMPItemChapterShouldSeek } = useMediaPlayer();
  const { setModalPlaylistAddTo } = useModals();
  const { queues } = useQueues();

  const itemChapterTitle = item_chapter.title || tMisc("untitled");
  const startTime = item_chapter.start_time;
  const endTime = item_chapter.end_time;

  const playButtonOnClick = () => {
    if (item_chapter.id === mpItemChapter?.id) {
      setMPIsPlaying(!mpIsPlaying);
    } else {
      setMPChannel(channel);
      setMPClip(null);
      setMPItem(item);
      setMPItemChapter(item_chapter);
      setMPItemChapterShouldSeek(true);
      setMPItemSoundbite(null);
      setMPIsPlaying(true);
    }
  };

  const addToQueueNextOnClick = async () => {
    if (channel) {
      const queue = getQueueForMedium(queues, channel.medium_id);
      if (queue) {
        showToastPromise(
          apiRequestService.reqQueueResourceItemChapterAddNext(queue.id_text, item_chapter.id_text),
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
          apiRequestService.reqQueueResourceItemChapterAddLast(queue.id_text, item_chapter.id_text),
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
      item: item,
      clip: null,
      item_chapter,
      item_soundbite: null
    });
  }

  const moreButtonMenuItems = [
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
  ]

  return (
    <div className={styles.row}>
      <Link href={url} tabIndex={-1}>
        <Image 
          src={item_chapter?.img || item_image?.url || channel_image?.url}
          alt={tInfo("chapter.chapter_image")}
          width={IMAGES.LIST.ITEM_CHAPTERS.SIZE}
          height={IMAGES.LIST.ITEM_CHAPTERS.SIZE}
          className={styles.image}
        />
        <Image 
          src={item_chapter?.img || item_image?.url || channel_image?.url}
          alt={tInfo("chapter.chapter_image")}
          width={IMAGES.LIST.ITEM_CHAPTERS.SIZE}
          height={IMAGES.LIST.ITEM_CHAPTERS.SIZE}
          className={styles.imageMobile}
        />
      </Link>
      <div className={styles.content}>
        <Link href={url}>
          <div className={styles.topSection}>
            <h3 className={styles.clipTitle}>{itemChapterTitle}</h3>
          </div>
        </Link>
        <div className={styles.bottomSection}>
          <div className={styles.bottomSectionStart}>
            <PlayButtonRow
              item_chapter={item_chapter}
              item={item}
              onClick={playButtonOnClick}
            />
            <div className={styles.timeSection}>
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

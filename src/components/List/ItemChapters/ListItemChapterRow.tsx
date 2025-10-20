"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { DTOChannel, DTOItem, DTOItemChapter, findDTOChannelImageBySize, findDTOItemImageBySize } from "podverse-helpers";
import React from "react";
import Image from "../../Image/Image";
import { ROUTES } from "../../../constants/routes";
import { IMAGES } from "../../../constants/images";
import { PlayButtonRow } from "../../MediaPlayer/Buttons/PlayButtonRow";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { ReadableTimeRange } from "../../Time/ReadableTimeRange";
import { ReadableDate } from "../../Time/ReadableDate";
import { useMediaPlayerResourceUpdate } from "../../../contexts/MediaPlayerResourceUpdate";
import styles from "../../../styles/components/List/ItemChapters/ListItemChapterRow.module.scss";

interface ListItemChapterRowProps {
  channel?: DTOChannel | null;
  item?: DTOItem | null;
  item_chapter: DTOItemChapter;
  showChannelInfo?: boolean;
  showItemInfo?: boolean;
}

export const ListItemChapterRow: React.FC<ListItemChapterRowProps> = (
  { channel, item, item_chapter, showChannelInfo, showItemInfo }) => {
  const url = `${ROUTES.CHAPTER}/${item_chapter.id_text}`;

  channel = channel || item?.channel || item_chapter.item_chapters_feed?.item?.channel || null;
  item = item || item_chapter.item_chapters_feed?.item || null;

  const channel_images = channel?.channel_images;
  const item_images = item?.item_images;

  const channel_image = findDTOChannelImageBySize(channel_images, IMAGES.LIST.CLIPS.SIZE_FIND_TARGET, 'lesser');
  const item_image = findDTOItemImageBySize(item_images, IMAGES.LIST.CLIPS.SIZE_FIND_TARGET, 'lesser');

  const tMisc = useTranslations("misc");
  const tInfo = useTranslations("info");
  const { mpItemChapter, mpIsPlaying, setMPIsPlaying } = useMediaPlayer();
  const mediaPlayerResourceUpdate = useMediaPlayerResourceUpdate();

  const itemChapterTitle = item_chapter.title || tMisc("untitled");
  const channelTitle = channel?.title || tMisc("untitled");
  const itemTitle = item?.title || tMisc("untitled");
  const itemPubDate = item?.pub_date;
  const startTime = item_chapter.start_time;
  const endTime = item_chapter.end_time;

  const playButtonOnClick = () => {
    if (item_chapter.id === mpItemChapter?.id) {
      setMPIsPlaying(!mpIsPlaying);
    } else if (channel && item) {
      mediaPlayerResourceUpdate({
        shouldPlay: true,
        channel: channel,
        clip: null,
        item: item,
        itemChapter: item_chapter,
        itemChapterShouldSeek: true,
        itemSoundbite: null,
        isPlaying: true
      });
    }
  };

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
            <h3
              className={
                styles.clipTitle +
                (mpItemChapter?.id_text === item_chapter.id_text && !showItemInfo ? ' ' + "highlighted-text" : '')
              }
            >
              {itemChapterTitle}
            </h3>
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
              item_chapter={item_chapter}
              item={item}
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
        </div>
      </div>
    </div>
  );
};

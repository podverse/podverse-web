"use client";

import { useTranslations } from "next-intl";
import { findDTOChannelImageBySize, findDTOItemImageBySize } from "podverse-helpers";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import styles from "../../../styles/components/MediaPlayer/Modal/MediaPlayerInfoModal.module.scss";
import { ReadableTimeRange } from "../../Time/ReadableTimeRange";

export const MediaPlayerInfoModal: React.FC = () => {
  const { mpChannel, mpItem, mpClip, mpItemChapter, mpItemSoundbite } = useMediaPlayer();
  const tMediaPlayer = useTranslations("media_player");
  const tMisc = useTranslations("misc");
  
  const channel_image = findDTOChannelImageBySize(mpChannel?.channel_images, 'largest');
  const item_image = findDTOItemImageBySize(mpItem?.item_images, 'largest');
  const defaultImageUrl = item_image?.url || channel_image?.url || undefined;
  let imageUrl = '';
  
  if (mpItemChapter) {
    imageUrl = mpItemChapter.img || defaultImageUrl || '';
  } else {
    imageUrl = defaultImageUrl || '';
  }

  return (
    <div className={styles.info}>
      <div className={styles.titleSection}>
        <div className={styles.itemTitle}>
          {mpItem?.title || tMisc("untitled")}
        </div>
        <div className={styles.channelTitle}>
          {mpChannel?.title || tMisc("untitled")}
        </div>
      </div>
      <div className={styles.imageWrapper}>
        <img
          className={styles.image}
          src={imageUrl}
          alt={tMediaPlayer("media_player_image")}
        />
      </div>
      <div className={styles.subtitleSection}>
        {
          mpClip && (
            <>
              <div className={styles.subtitle}>
                {mpClip?.title || tMisc("untitled")}
              </div>
              <div className={styles.timeRange}>
                <ReadableTimeRange
                  startTime={mpClip?.start_time}
                  endTime={mpClip?.end_time} />
              </div>
            </>
          )
        }
        {
          mpItemChapter && (
            <>
              <div className={styles.subtitle}>
                {mpItemChapter?.title || tMisc("untitled")}
              </div>
              <div className={styles.timeRange}>
                <ReadableTimeRange
                  startTime={mpItemChapter?.start_time}
                  endTime={mpItemChapter?.end_time} />
              </div>
            </>
          )
        }
        {
          mpItemSoundbite && (
            <>
              <div className={styles.subtitle}>
                {mpItemSoundbite?.title || tMisc("untitled")}
              </div>
              <div className={styles.timeRange}>
                <ReadableTimeRange
                  startTime={mpItemSoundbite?.start_time}
                  endTime={`${Number(mpItemSoundbite.start_time) + Number(mpItemSoundbite.duration)}`} />
              </div>
            </>
          )
        }
      </div>
    </div>
  )
}

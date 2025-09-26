"use client";

import { useTranslations } from "next-intl";
import { findDTOChannelImageBySize, findDTOItemImageBySize } from "podverse-helpers";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import styles from "../../../styles/components/MediaPlayer/Modal/MediaPlayerInfoModal.module.scss";
import { ReadableTimeRange } from "../../Time/ReadableTimeRange";

export const MediaPlayerInfoModal: React.FC = () => {
  const { mpChannel, mpItem, mpClip } = useMediaPlayer();
  const tMediaPlayer = useTranslations("media_player");
  const tMisc = useTranslations("misc");
  
  const channel_image = findDTOChannelImageBySize(mpChannel?.channel_images, 'largest');
  const item_image = findDTOItemImageBySize(mpItem?.item_images, 'largest');
  const imageUrl = item_image?.url || channel_image?.url || undefined;
  
  const subtitle = mpClip?.title || tMisc("untitled");

  return (
    <div className={styles.info}>
      <div className={styles.imageWrapper}>
        <img
          className={styles.image}
          src={imageUrl}
          alt={tMediaPlayer("media_player_image")}
        />
      </div>
      <div className={styles.textSection}>
        {
          mpClip && (
            <>
              <div className={styles.subtitle}>
                {subtitle}
              </div>
              <div className={styles.timeRange}>
                <ReadableTimeRange
                  startTime={mpClip?.start_time}
                  endTime={mpClip?.end_time} />
              </div>
            </>
          )
        }
      </div>
    </div>
  )
}

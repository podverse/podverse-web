"use client";

import { useTranslations } from "next-intl";
import { findDTOChannelImageBySize, findDTOItemImageBySize } from "podverse-helpers";
import Image from "../../Image/Image";
import { IMAGES } from "../../../constants/images";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import styles from "../../../styles/components/MediaPlayer/Mobile/MediaPlayerInfoMobile.module.scss";

export const MediaPlayerInfoMobile: React.FC = () => {
  const { mpChannel, mpItem } = useMediaPlayer();
  const tMediaPlayer = useTranslations("media_player");
  const tMisc = useTranslations("misc");

  const title = mpItem?.title || tMisc("untitled");
  const subtitle = mpChannel?.title || tMisc("untitled");

  const channel_image = findDTOChannelImageBySize(mpChannel?.channel_images, IMAGES.MEDIA_PLAYER.MOBILE.MINI.SIZE_FIND_TARGET, 'greater');
  const item_image = findDTOItemImageBySize(mpItem?.item_images, IMAGES.MEDIA_PLAYER.MOBILE.MINI.SIZE_FIND_TARGET, 'greater');
  const imageUrl = item_image?.url || channel_image?.url || undefined;

  return (
    <div className={styles.info}>
      <button
        className={styles.button}
        aria-description={tMediaPlayer("show_fullscreen_media_player")}>
        <Image
          src={imageUrl}
          height={IMAGES.MEDIA_PLAYER.MOBILE.MINI.SIZE}
          width={IMAGES.MEDIA_PLAYER.MOBILE.MINI.SIZE}
          alt={tMediaPlayer("media_player_image")}
        />
        <div className={styles.textSection}>
          <div className={styles.title}>
            {title}
          </div>
          <div className={styles.subtitle}>
            {subtitle}
          </div>
        </div>
      </button>
    </div>
  )
}

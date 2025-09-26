"use client";

import { useTranslations } from "next-intl";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import styles from "../../../styles/components/MediaPlayer/Desktop/MediaPlayerMarqueeDesktop.module.scss";

export const MediaPlayerTopSectionDesktop = () => {
  const tMisc = useTranslations("misc");
  const { mpClip, mpItemChapter, mpItemSoundbite } = useMediaPlayer();

  if (!mpClip && !mpItemSoundbite && !mpItemChapter) {
    return null;
  }

  const title = mpClip?.title || mpItemSoundbite?.title || mpItemChapter?.title || tMisc("untitled");

  return (
    <div className={styles.marquee}>
      <div className={styles.marqueeText}>
        {title}
      </div>
    </div>
  )
}

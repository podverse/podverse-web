"use client";

import { useMediaPlayer } from "../../contexts/MediaPlayer";
import styles from "../../styles/components/MediaPlayer/MediaPlayer.module.scss";
import { MediaPlayerDesktop } from "./Desktop/MediaPlayerDesktop";

export const MediaPlayer = () => {
  const { mpChannel } = useMediaPlayer();
  const hasContent = !!mpChannel;

  if (!hasContent) {
    return null;
  }

  return (
    <aside className={styles.player}>
      <MediaPlayerDesktop />
    </aside>
  )
}

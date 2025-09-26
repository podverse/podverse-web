"use client";

import { MediaPlayerProgress } from "../Sliders/MediaPlayerProgress";
import styles from "../../../styles/components/MediaPlayer/Mobile/MediaPlayerControlsMobile.module.scss";

export const MediaPlayerControlsMobile = () => {
  return (
    <div className={styles.controls}>
      <MediaPlayerProgress />
    </div>
  )
}

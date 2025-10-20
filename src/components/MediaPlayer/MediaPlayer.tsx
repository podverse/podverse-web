"use client";

import { MediaPlayerDesktop } from "./Desktop/MediaPlayerDesktop";
import { MediaPlayerMobile } from "./Mobile/MediaPlayerMobile";
import { MediaPlayerModal } from "./Modal/MediaPlayerModal";
import styles from "../../styles/components/MediaPlayer/MediaPlayer.module.scss";

export const MediaPlayer = () => {
  return (
    <aside id="media-player" className={styles.player}>
      <MediaPlayerDesktop />
      <MediaPlayerMobile />
      <MediaPlayerModal />
    </aside>
  )
}

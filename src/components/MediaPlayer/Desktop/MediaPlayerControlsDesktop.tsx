"use client";

import { PlayButton } from "../Buttons/PlayButton";
import { JumpBackButton } from "../Buttons/JumpBackButton";
import { JumpForwardButton } from "../Buttons/JumpForwardButton";
import { TrackPreviousButton } from "../Buttons/TrackPreviousButton";
import { TrackNextButton } from "../Buttons/TrackNextButton";
import { MediaPlayerProgress } from "../Sliders/MediaPlayerProgress";
import styles from "../../../styles/components/MediaPlayer/Desktop/MediaPlayerControlsDesktop.module.scss";

export const MediaPlayerControlsDesktop = () => {
  return (
    <div className={styles.controls}>
      <div className={styles.topSection}>
        <TrackPreviousButton />
        <JumpBackButton />
        <PlayButton />
        <JumpForwardButton />
        <TrackNextButton />
      </div>
      <div className={styles.bottomSection}>
        <MediaPlayerProgress />
      </div>
    </div>
  )
}

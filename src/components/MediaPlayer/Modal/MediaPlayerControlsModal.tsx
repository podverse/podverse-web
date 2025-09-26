"use client";

import { PlayButton } from "../Buttons/PlayButton";
import { JumpBackButton } from "../Buttons/JumpBackButton";
import { JumpForwardButton } from "../Buttons/JumpForwardButton";
import { TrackPreviousButton } from "../Buttons/TrackPreviousButton";
import { TrackNextButton } from "../Buttons/TrackNextButton";
import { MediaPlayerProgress } from "../Sliders/MediaPlayerProgress";
import styles from "../../../styles/components/MediaPlayer/Modal/MediaPlayerControlsModal.module.scss";

export const MediaPlayerControlsModal = () => {
  return (
    <div className={styles.controls}>
      <div className={styles.progressSection}>
        <MediaPlayerProgress />
      </div>
      <div className={styles.butttonsSection}>
        <TrackPreviousButton />
        <JumpBackButton />
        <PlayButton />
        <JumpForwardButton />
        <TrackNextButton />
      </div>
    </div>
  )
}

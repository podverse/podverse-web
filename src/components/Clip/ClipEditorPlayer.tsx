"use client";

import { IncrementBackButton } from "../MediaPlayer/Buttons/IncrementBackButton";
import { IncrementForwardButton } from "../MediaPlayer/Buttons/IncrementForwardButton";
import { JumpBackButton } from "../MediaPlayer/Buttons/JumpBackButton";
import { JumpForwardButton } from "../MediaPlayer/Buttons/JumpForwardButton";
import { PlayButton } from "../MediaPlayer/Buttons/PlayButton";
import { MediaPlayerProgressDesktop } from "../MediaPlayer/Desktop/MediaPlayerProgressDesktop";
import styles from "../../styles/components/Clip/ClipEditorPlayer.module.scss";

type ClipEditorPlayerProps = {
  startTime?: number | null;
  endTime?: number | null;
};

export const ClipEditorPlayer = ({ startTime, endTime }: ClipEditorPlayerProps) => {
  return (
    <div className={styles.controls}>
      <div className={styles.topSection}>
        <JumpBackButton />
        <IncrementBackButton />
        <PlayButton />
        <IncrementForwardButton />
        <JumpForwardButton />
      </div>
      <div className={styles.bottomSection}>
        <MediaPlayerProgressDesktop
          isClipForm
          overrideHighlightStartTime={startTime}
          overrideHighlightEndTime={endTime}
        />
      </div>
    </div>
  )
}

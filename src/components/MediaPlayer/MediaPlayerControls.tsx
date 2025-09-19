import { PlayButton } from "./Buttons/PlayButton";
import { JumpBackButton } from "./Buttons/JumpBackButton";
import { JumpForwardButton } from "./Buttons/JumpForwardButton";
import { TrackPreviousButton } from "./Buttons/TrackPreviousButton";
import { TrackNextButton } from "./Buttons/TrackNextButton";
import styles from "../../styles/components/MediaPlayer/MediaPlayerControls.module.scss";

export const MediaPlayerControls = () => {
  return (
    <div className={styles.controls}>
      <TrackPreviousButton />
      <JumpBackButton />
      <PlayButton />
      <JumpForwardButton />
      <TrackNextButton />
    </div>
  )
}

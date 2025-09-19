import styles from "../../../styles/components/MediaPlayer/Desktop/MediaPlayerButtonsDesktop.module.scss";
import { ClipButton } from "../Buttons/ClipButton";
import { PlaybackSpeedButton } from "../Buttons/PlaybackSpeedButton";
import { PlaylistAddToButton } from "../Buttons/PlaylistAddToButton";

export const MediaPlayerButtonsDesktop = () => {
  return (
    <div className={styles.buttons}>
      <PlaylistAddToButton />
      <PlaybackSpeedButton />
      <ClipButton />
    </div>
  )
}

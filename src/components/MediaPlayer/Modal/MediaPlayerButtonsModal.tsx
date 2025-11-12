import { ClipButton } from "../Buttons/ClipButton";
import { PlaybackSpeedButton } from "../Buttons/PlaybackSpeedButton";
import { PlaylistAddToButton } from "../Buttons/PlaylistAddToButton";
import styles from "../../../styles/components/MediaPlayer/Modal/MediaPlayerButtonsModal.module.scss";
import { SettingsButton } from "../Buttons/SettingsButton";

export const MediaPlayerButtonsModal = () => {
  return (
    <div className={styles.buttons}>
      <div className={styles.startSection}>
        <PlaylistAddToButton />
        <PlaybackSpeedButton />
        <ClipButton />
        <SettingsButton />
      </div>
    </div>
  )
}

import { ClipButton } from "../Buttons/ClipButton";
import { MuteButton } from "../Buttons/MuteButton";
import { PlaybackSpeedButton } from "../Buttons/PlaybackSpeedButton";
import { PlaylistAddToButton } from "../Buttons/PlaylistAddToButton";
import { VolumeSlider } from "../Sliders/VolumeSlider";
import styles from "../../../styles/components/MediaPlayer/Desktop/MediaPlayerButtonsDesktop.module.scss";
import { SettingsButton } from "../Buttons/SettingsButton";

export const MediaPlayerButtonsDesktop = () => {
  return (
    <div className={styles.buttons}>
      <div className={styles.startSection}>
        <PlaylistAddToButton />
        <PlaybackSpeedButton />
        <ClipButton />
        <SettingsButton />
      </div>
      <div className={styles.endSection}>
        <VolumeSlider />
        <MuteButton />
      </div>
    </div>
  )
}

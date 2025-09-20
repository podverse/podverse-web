import { ClipButton } from "../Buttons/ClipButton";
import { MuteButton } from "../Buttons/MuteButton";
import { PlaybackSpeedButton } from "../Buttons/PlaybackSpeedButton";
import { PlaylistAddToButton } from "../Buttons/PlaylistAddToButton";
import { VolumeSlider } from "../Sliders/VolumeSlider";
import styles from "../../../styles/components/MediaPlayer/Desktop/MediaPlayerButtonsDesktop.module.scss";

export const MediaPlayerButtonsDesktop = () => {
  return (
    <div className={styles.buttons}>
      <div className={styles.startSection}>
        <PlaylistAddToButton />
        <PlaybackSpeedButton />
        <ClipButton />
      </div>
      <div className={styles.endSection}>
        <VolumeSlider />
        <MuteButton />
      </div>
    </div>
  )
}

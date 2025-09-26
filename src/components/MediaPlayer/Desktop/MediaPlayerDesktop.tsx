import { MediaPlayerControlsDesktop } from "./MediaPlayerControlsDesktop";
import { MediaPlayerInfoDesktop } from "./MediaPlayerInfoDesktop";
import { MediaPlayerButtonsDesktop } from "./MediaPlayerButtonsDesktop";
import styles from "../../../styles/components/MediaPlayer/Desktop/MediaPlayerDesktop.module.scss";
import { MediaPlayerMarqueeDesktop } from "./MediaPlayerMarqueeDesktop";

export const MediaPlayerDesktop = () => {
  return (
    <div className={styles.playerDesktop}>
      <MediaPlayerMarqueeDesktop />
      <div className={styles.bottomSection}>
        <MediaPlayerInfoDesktop />
        <MediaPlayerControlsDesktop />
        <MediaPlayerButtonsDesktop />
      </div>
    </div>
  )
}

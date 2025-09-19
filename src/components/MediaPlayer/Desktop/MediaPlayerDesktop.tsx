import { MediaPlayerControlsDesktop } from "./MediaPlayerControlsDesktop";
import { MediaPlayerInfoDesktop } from "./MediaPlayerInfoDesktop";
import { MediaPlayerButtonsDesktop } from "./MediaPlayerButtonsDesktop";
import styles from "../../../styles/components/MediaPlayer/Desktop/MediaPlayerDesktop.module.scss";

export const MediaPlayerDesktop = () => {
  return (
    <aside className={styles.playerDesktop}>
      <MediaPlayerInfoDesktop />
      <MediaPlayerControlsDesktop />
      <MediaPlayerButtonsDesktop />
    </aside>
  )
}

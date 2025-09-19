import { MediaPlayerControlsDesktop } from "./MediaPlayerControlsDesktop";
import styles from "../../../styles/components/MediaPlayer/Desktop/MediaPlayerDesktop.module.scss";

export const MediaPlayerDesktop = () => {
  return (
    <aside className={styles.playerDesktop}>
      <MediaPlayerControlsDesktop />
    </aside>
  )
}

import { MediaPlayerControls } from "./MediaPlayerControls";
import styles from "../../styles/components/MediaPlayer/MediaPlayerDesktop.module.scss";

export const MediaPlayerDesktop = () => {
  return (
    <aside className={styles.playerDesktop}>
      <MediaPlayerControls />
    </aside>
  )
}

import styles from "../../styles/components/MediaPlayer/MediaPlayer.module.scss";
import { MediaPlayerDesktop } from "./MediaPlayerDesktop";

export const MediaPlayer = () => {
  return (
    <aside className={styles.player}>
      <MediaPlayerDesktop />
    </aside>
  )
}

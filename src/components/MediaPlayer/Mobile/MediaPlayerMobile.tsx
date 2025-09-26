
import { MediaPlayerButtonsMobile } from "./MediaPlayerButtonsMobile";
import { MediaPlayerControlsMobile } from "./MediaPlayerControlsMobile";
import { MediaPlayerInfoMobile } from "./MediaPlayerInfoMobile";
import { MediaPlayerMarqueeMobile } from "./MediaPlayerMarqueeMobile";
import styles from "../../../styles/components/MediaPlayer/Mobile/MediaPlayerMobile.module.scss";

export const MediaPlayerMobile = () => {
  return (
    <div className={styles.playerMobile}>
      <MediaPlayerMarqueeMobile />
      <div className={styles.infoSection}>
        <MediaPlayerInfoMobile />
        <MediaPlayerButtonsMobile />
      </div>
      <MediaPlayerControlsMobile />
    </div>
  )
}

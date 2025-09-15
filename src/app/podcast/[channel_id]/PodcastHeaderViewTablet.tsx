import PodcastHeaderButtons from "./PodcastHeaderButtons"
import { PodcastHeaderImage } from "./PodcastHeaderImage"
import { PodcastHeaderSubscribeSection } from "./PodcastHeaderSubscribeSection"
import PodcastHeaderSubtitle from "./PodcastHeaderSubtitle"
import styles from "../../../styles/app/podcast/PodcastHeaderViewTablet.module.scss";
import { DTOChannel } from "podverse-helpers";

type PodcastHeaderViewTabletProps = {
  channel: DTOChannel;
}

export const PodcastHeaderViewTablet: React.FC<PodcastHeaderViewTabletProps> = ({ channel }) => {
  return (
    <div className={styles.contentTablet}>
      <div className={styles.topSection}>
        <PodcastHeaderImage channel={channel} />
        <h1 className={styles.title}>{channel.title}</h1>
      </div>
      <div className={styles.bottomSection}>
        <div className={styles.textSection}>
          <PodcastHeaderSubtitle channel={channel} />
          <PodcastHeaderButtons channel={channel} />
        </div>
        <PodcastHeaderSubscribeSection channel={channel} />
      </div>
    </div>
  )
}

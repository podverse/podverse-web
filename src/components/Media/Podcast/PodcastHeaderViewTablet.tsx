import { DTOChannel, DTOItem } from "podverse-helpers";
import PodcastHeaderButtons from "./PodcastHeaderButtons"
import { PodcastHeaderImage } from "./PodcastHeaderImage"
import { PodcastHeaderSubscribeSection } from "./PodcastHeaderSubscribeSection"
import PodcastHeaderSubtitle from "./PodcastHeaderSubtitle"
import styles from "../../../styles/components/Media/Podcast/PodcastHeaderViewTablet.module.scss";

type PodcastHeaderViewTabletProps = {
  channel: DTOChannel;
  item?: DTOItem;
}

export const PodcastHeaderViewTablet: React.FC<PodcastHeaderViewTabletProps> = ({ channel, item }) => {
  return (
    <div className={styles.contentTablet}>
      <div className={styles.topSection}>
        <PodcastHeaderImage channel={channel} item={item} />
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

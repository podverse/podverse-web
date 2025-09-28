import { DTOChannel, DTOItem } from "podverse-helpers";
import PodcastHeaderButtons from "./PodcastHeaderButtons"
import { PodcastHeaderImage } from "./PodcastHeaderImage"
import { PodcastHeaderSubscribeSection } from "./PodcastHeaderSubscribeSection"
import PodcastHeaderSubtitle from "./PodcastHeaderSubtitle"
import styles from "../../../styles/components/Media/Podcast/PodcastHeaderViewDesktop.module.scss";

type PodcastHeaderViewDesktopProps = {
  channel: DTOChannel;
  item?: DTOItem;
}

export const PodcastHeaderViewDesktop: React.FC<PodcastHeaderViewDesktopProps> = ({ channel, item }) => {
  return (
    <div className={styles.contentDesktop}>
      <PodcastHeaderImage channel={channel} item={item} />
      <div className={styles.textSection}>
        <h1 className={styles.title}>{channel.title}</h1>
        <div className={styles.bottomSection}>
          <PodcastHeaderSubtitle channel={channel} />
          <PodcastHeaderButtons channel={channel} item={item} />
        </div>
      </div>
      <PodcastHeaderSubscribeSection channel={channel} />
    </div>
  )
}

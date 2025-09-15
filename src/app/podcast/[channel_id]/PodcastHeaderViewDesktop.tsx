import PodcastHeaderButtons from "./PodcastHeaderButtons"
import { PodcastHeaderImage } from "./PodcastHeaderImage"
import { PodcastHeaderSubscribeSection } from "./PodcastHeaderSubscribeSection"
import PodcastHeaderSubtitle from "./PodcastHeaderSubtitle"
import styles from "../../../styles/app/podcast/PodcastHeaderViewDesktop.module.scss";
import { DTOChannel } from "podverse-helpers";

type PodcastHeaderViewDesktopProps = {
  channel: DTOChannel;
}

export const PodcastHeaderViewDesktop: React.FC<PodcastHeaderViewDesktopProps> = ({ channel }) => {
  return (
    <div className={styles.contentDesktop}>
      <PodcastHeaderImage channel={channel} />
      <div className={styles.textSection}>
        <h1 className={styles.title}>{channel.title}</h1>
        <div className={styles.bottomSection}>
          <PodcastHeaderSubtitle channel={channel} />
          <PodcastHeaderButtons channel={channel} />
        </div>
      </div>
      <PodcastHeaderSubscribeSection channel={channel} />
    </div>
  )
}

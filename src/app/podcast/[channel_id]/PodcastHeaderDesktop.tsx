import PodcastHeaderButtons from "./PodcastHeaderButtons"
import { PodcastHeaderImage } from "./PodcastHeaderImage"
import { PodcastHeaderSubscribeSection } from "./PodcastHeaderSubscribeSection"
import PodcastHeaderSubtitle from "./PodcastHeaderSubtitle"
import styles from "../../../styles/app/podcast/PodcastHeaderDesktop.module.scss";
import { DTOChannel } from "podverse-helpers";

type PodcastHeaderDesktopProps = {
  channel: DTOChannel;
}

export const PodcastHeaderDesktop: React.FC<PodcastHeaderDesktopProps> = ({ channel }) => {
  return (
    <div className={styles.contentXL}>
      <PodcastHeaderImage channel={channel} />
      <div className={styles.textSection}>
        <h1 className={styles.title}>{channel.title}</h1>
        <PodcastHeaderSubtitle channel={channel} />
        <PodcastHeaderButtons channel={channel} />
      </div>
      <PodcastHeaderSubscribeSection channel={channel} />
    </div>
  )
}

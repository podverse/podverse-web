import { DTOChannel, DTOItem } from "podverse-helpers";
import PodcastHeaderButtons from "./PodcastHeaderButtons"
import { PodcastHeaderImage } from "./PodcastHeaderImage"
import { PodcastHeaderSubscribeSection } from "./PodcastHeaderSubscribeSection"
import PodcastHeaderSubtitle from "./PodcastHeaderSubtitle"
import styles from "../../../styles/components/Media/Podcast/PodcastHeaderViewDesktop.module.scss";
import Link from "../../Link/Link";
import { ROUTES } from "../../../constants/routes";

type PodcastHeaderViewDesktopProps = {
  channel: DTOChannel;
  item?: DTOItem;
}

export const PodcastHeaderViewDesktop: React.FC<PodcastHeaderViewDesktopProps> = ({ channel, item }) => {
  return (
    <div className={styles.contentDesktop}>
      <PodcastHeaderImage channel={channel} item={item} />
      <div className={styles.textSection}>
        <Link href={`${ROUTES.PODCAST}/${channel.id_text}`}>
          <h1 className={styles.title}>{channel.title}</h1>
        </Link>
        <div className={styles.bottomSection}>
          <PodcastHeaderSubtitle channel={channel} />
          <PodcastHeaderButtons channel={channel} item={item} />
        </div>
      </div>
      <PodcastHeaderSubscribeSection channel={channel} />
    </div>
  )
}

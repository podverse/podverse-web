import { DTOChannel, DTOClip, DTOItem, DTOItemChapter, DTOItemSoundbite } from "podverse-helpers";
import { PodcastHeaderButtons } from "./PodcastHeaderButtons"
import { PodcastHeaderImage } from "./PodcastHeaderImage"
import { PodcastHeaderSubtitle } from "./PodcastHeaderSubtitle"
import { Link } from "../../Link/Link";
import { ROUTES } from "../../../constants/routes";
import styles from "../../../styles/components/Media/Podcast/PodcastHeaderViewDesktop.module.scss";

type PodcastHeaderViewDesktopProps = {
  channel: DTOChannel;
  item?: DTOItem;
  clip?: DTOClip;
  item_soundbite?: DTOItemSoundbite;
  item_chapter?: DTOItemChapter;
}

export const PodcastHeaderViewDesktop: React.FC<PodcastHeaderViewDesktopProps> = ({ channel, item, clip, item_soundbite, item_chapter }) => {
  return (
    <div className={styles.contentDesktop}>
      <PodcastHeaderImage channel={channel} item={item} />
      <div className={styles.textSection}>
        <Link href={`${ROUTES.PODCAST}/${channel.id_text}`}>
          <h1 className={styles.title}>{channel.title}</h1>
        </Link>
        <div className={styles.bottomSection}>
          <PodcastHeaderSubtitle channel={channel} />
          <PodcastHeaderButtons channel={channel} item={item} clip={clip} item_soundbite={item_soundbite} item_chapter={item_chapter} />
        </div>
      </div>
    </div>
  )
}

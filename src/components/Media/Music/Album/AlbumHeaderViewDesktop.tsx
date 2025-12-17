import { DTOChannel, DTOItem } from "podverse-helpers";
import { AlbumHeaderButtons } from "./AlbumHeaderButtons"
import { AlbumHeaderImage } from "./AlbumHeaderImage"
import { AlbumHeaderSubtitle } from "./AlbumHeaderSubtitle"
import { Link } from "../../../Link/Link";
import { ROUTES } from "../../../../constants/routes";
import styles from "../../../../styles/components/Media/Podcast/PodcastHeaderViewDesktop.module.scss";

type AlbumHeaderViewDesktopProps = {
  channel: DTOChannel;
  item?: DTOItem;
}

export const AlbumHeaderViewDesktop: React.FC<AlbumHeaderViewDesktopProps> = ({ channel, item }) => {
  return (
    <div className={styles.contentDesktop}>
      <AlbumHeaderImage channel={channel} item={item} />
      <div className={styles.textSection}>
        <Link href={`${ROUTES.ALBUM}/${channel.id_text}`}>
          <h1 className={styles.title}>{channel.title}</h1>
        </Link>
        <div className={styles.bottomSection}>
          <AlbumHeaderSubtitle channel={channel} />
          <AlbumHeaderButtons channel={channel} item={item} />
        </div>
      </div>
    </div>
  )
}

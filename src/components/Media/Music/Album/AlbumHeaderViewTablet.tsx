import { DTOChannel, DTOItem } from "podverse-helpers";
import { AlbumHeaderButtons } from "./AlbumHeaderButtons"
import { AlbumHeaderImage } from "./AlbumHeaderImage"
import { AlbumHeaderSubtitle } from "./AlbumHeaderSubtitle"
import { Link } from "../../../Link/Link";
import { ROUTES } from "../../../../constants/routes";
import styles from "../../../../styles/components/Media/Podcast/PodcastHeaderViewTablet.module.scss";

type AlbumHeaderViewTabletProps = {
  channel: DTOChannel;
  item?: DTOItem;
}

export const AlbumHeaderViewTablet: React.FC<AlbumHeaderViewTabletProps> = ({ channel, item }) => {
  return (
    <div className={styles.contentTablet}>
      <div className={styles.topSection}>
        <AlbumHeaderImage channel={channel} item={item} />
        <Link href={`${ROUTES.ALBUM}/${channel.id_text}`}>
          <h1 className={styles.title}>{channel.title}</h1>
        </Link>
      </div>
      <div className={styles.bottomSection}>
        <div className={styles.textSection}>
          <AlbumHeaderSubtitle channel={channel} />
          <AlbumHeaderButtons channel={channel} item={item} />
        </div>
      </div>
    </div>
  )
}

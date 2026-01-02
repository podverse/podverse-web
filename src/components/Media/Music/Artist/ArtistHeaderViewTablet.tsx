import { DTOChannel } from "podverse-helpers";
import { ArtistHeaderButtons } from "./ArtistHeaderButtons"
import { ArtistHeaderImage } from "./ArtistHeaderImage"
import { ArtistHeaderSubtitle } from "./ArtistHeaderSubtitle"
import { Link } from "../../../Link/Link";
import { ROUTES } from "../../../../constants/routes";
import styles from "../../../../styles/components/Media/Podcast/PodcastHeaderViewTablet.module.scss";

type ArtistHeaderViewTabletProps = {
  channel: DTOChannel;
}

export const ArtistHeaderViewTablet: React.FC<ArtistHeaderViewTabletProps> = ({ channel }) => {
  return (
    <div className={styles.contentTablet}>
      <div className={styles.topSection}>
        <ArtistHeaderImage channel={channel} />
        <Link href={`${ROUTES.ARTIST}/${channel.id_text}`}>
          <h1 className={styles.title}>{channel.title}</h1>
        </Link>
      </div>
      <div className={styles.bottomSection}>
        <div className={styles.textSection}>
          <ArtistHeaderSubtitle channel={channel} />
          <ArtistHeaderButtons channel={channel} />
        </div>
      </div>
    </div>
  )
}

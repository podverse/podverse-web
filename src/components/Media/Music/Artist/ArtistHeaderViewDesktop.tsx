import { DTOChannel } from "podverse-helpers";
import { ArtistHeaderButtons } from "./ArtistHeaderButtons"
import { ArtistHeaderImage } from "./ArtistHeaderImage"
import { ArtistHeaderSubtitle } from "./ArtistHeaderSubtitle"
import { Link } from "../../../Link/Link";
import { ROUTES } from "../../../../constants/routes";
import styles from "../../../../styles/components/Media/Podcast/PodcastHeaderViewDesktop.module.scss";

type ArtistHeaderViewDesktopProps = {
  channel: DTOChannel;
}

export const ArtistHeaderViewDesktop: React.FC<ArtistHeaderViewDesktopProps> = ({ channel }) => {
  return (
    <div className={styles.contentDesktop}>
      <ArtistHeaderImage channel={channel} />
      <div className={styles.textSection}>
        <Link href={`${ROUTES.ARTIST}/${channel.id_text}`}>
          <h1 className={styles.title}>{channel.title}</h1>
        </Link>
        <div className={styles.bottomSection}>
          <ArtistHeaderSubtitle channel={channel} />
          <ArtistHeaderButtons channel={channel} />
        </div>
      </div>
    </div>
  )
}

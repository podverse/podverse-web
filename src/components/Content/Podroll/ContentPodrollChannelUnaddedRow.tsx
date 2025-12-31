import { useTranslations } from "next-intl";
import { PodcastBatchByFeedGuidResponse } from "podverse-helpers";
import { Link } from "../../Link/Link";
import { WEB } from "../../../constants/web";
import { IMAGES } from "../../../constants/images";
import { Image } from "../../Image/Image";
import styles from "../../../styles/components/Content/Podroll/ContentPodrollChannelRow.module.scss";

type ContentPodrollChannelUnaddedRowProps = {
  channelUnadded: PodcastBatchByFeedGuidResponse['feeds'][number];
}

export const ContentPodrollChannelUnaddedRow = ({ channelUnadded }: ContentPodrollChannelUnaddedRowProps) => {
  if (!channelUnadded) {
    return null;
  }

  const tMedia = useTranslations("media");
  const tMisc = useTranslations("misc");
  
  return (
    <div className={styles.row}>
      <Link
        className={styles.link}
        href={`${WEB.origin}/podcast-index/feed/${channelUnadded.id}`}
        color="secondary">
        <Image
          className={styles.image}
          src={channelUnadded.image}
          alt={channelUnadded.title || tMedia("image")}
          width={IMAGES.PODROLL.SQUARE.SIZE}
          height={IMAGES.PODROLL.SQUARE.SIZE}
        />
        <div className={styles.textWrapper}>
          <div className={styles.title}>
            {channelUnadded.title || tMisc("untitled") }
          </div>
        </div>
      </Link>
    </div>
  )
}

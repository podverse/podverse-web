import { useTranslations } from "next-intl";
import { EpisodeByGuidResponse } from "podverse-helpers";
import { Link } from "../../Link/Link";
import { WEB } from "../../../constants/web";
import { IMAGES } from "../../../constants/images";
import { Image } from "../../Image/Image";
import styles from "../../../styles/components/Content/Podroll/ContentPodrollItemRow.module.scss";

type ContentPodrollItemUnaddedRowProps = {
  itemUnadded: EpisodeByGuidResponse['episode'];
}

export const ContentPodrollItemUnaddedRow = ({ itemUnadded }: ContentPodrollItemUnaddedRowProps) => {
  if (!itemUnadded) {
    return null;
  }

  const tMedia = useTranslations("media");
  const tMisc = useTranslations("misc");

  return (
    <div className={styles.row}>
      <Link
        className={styles.link}
        href={`${WEB.origin}/podcast-index/feed/${itemUnadded.feedId}`}
        color="secondary">
        <Image
          className={styles.image}
          src={itemUnadded.image}
          alt={itemUnadded.title || tMedia("image")}
          width={IMAGES.PODROLL.SQUARE.SIZE}
          height={IMAGES.PODROLL.SQUARE.SIZE}
        />
        <div className={styles.textWrapper}>
          <div className={styles.title}>
            {itemUnadded.feedTitle || tMisc("untitled") }
          </div>
          <div className={styles.subtitle}>
            {itemUnadded.title || tMisc("untitled") }
          </div>
        </div>
      </Link>
    </div>
  )
}

import { useTranslations } from "next-intl";
import { findDTOItemImageBySize, PodrollItem } from "podverse-helpers";
import Link from "../../Link/Link";
import { WEB } from "../../../constants/web";
import { IMAGES } from "../../../constants/images";
import Image from "../../Image/Image";
import styles from "../../../styles/components/Content/Podroll/ContentPodrollItemRow.module.scss";

type ContentPodrollItemRowProps = {
  item: PodrollItem;
}

export const ContentPodrollItemRow = ({ item }: ContentPodrollItemRowProps) => {
  if (!item) {
    return null;
  }

  const tMedia = useTranslations("media");
  const item_image = findDTOItemImageBySize(item.item_images, IMAGES.PODROLL.SQUARE.SIZE_FIND_TARGET, 'greater');

  return (
    <div className={styles.row}>
      <Link
        className={styles.link}
        href={`${WEB.origin}/episode/${item.id_text}`}
        color="secondary">
        <Image
          className={styles.image}
          src={item_image?.url}
          alt={item.title || tMedia("podcast.episode_image")}
          width={IMAGES.PODROLL.SQUARE.SIZE}
          height={IMAGES.PODROLL.SQUARE.SIZE}
        />
        <div className={styles.textWrapper}>
          <div className={styles.title}>
            {item.channel.title}
          </div>
          <div className={styles.subtitle}>
            {item.title}
          </div>
        </div>
      </Link>
    </div>
  )
}

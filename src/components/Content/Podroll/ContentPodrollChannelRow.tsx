import { useTranslations } from "next-intl";
import { DTOChannel, findDTOChannelImageBySize } from "podverse-helpers";
import Link from "../../Link/Link";
import { WEB } from "../../../constants/web";
import { IMAGES } from "../../../constants/images";
import { Image } from "../../Image/Image";
import styles from "../../../styles/components/Content/Podroll/ContentPodrollChannelRow.module.scss";

type ContentPodrollChannelRowProps = {
  channel: DTOChannel;
}

export const ContentPodrollChannelRow = ({ channel }: ContentPodrollChannelRowProps) => {
  if (!channel) {
    return null;
  }

  const tMedia = useTranslations("media");
  const channel_image = findDTOChannelImageBySize(channel.channel_images, IMAGES.PODROLL.SQUARE.SIZE_FIND_TARGET, 'greater');
  
  return (
    <div className={styles.row}>
      <Link
        className={styles.link}
        href={`${WEB.origin}/podcast/${channel.id_text}`}
        color="secondary">
        <Image
          className={styles.image}
          src={channel_image?.url}
          alt={channel.title || tMedia("podcast.podcast_image")}
          width={IMAGES.PODROLL.SQUARE.SIZE}
          height={IMAGES.PODROLL.SQUARE.SIZE}
        />
        <div className={styles.textWrapper}>
          <div className={styles.title}>
            {channel.title}
          </div>
        </div>
      </Link>
    </div>
  )
}

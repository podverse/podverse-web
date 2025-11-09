"use client";

import { useTranslations } from "next-intl";
import { DTOChannel, DTOItem, findDTOChannelImageBySize, findDTOItemImageBySize } from "podverse-helpers";
import { Image } from "../../../components/Image/Image";
import { IMAGES } from "../../../constants/images";
import styles from "../../../styles/components/Media/Podcast/PodcastHeaderImage.module.scss";

type PodcastHeaderImageProps = {
  channel: DTOChannel;
  item?: DTOItem;
};

export const PodcastHeaderImage = ({ channel, item }: PodcastHeaderImageProps) => {
  const tMedia = useTranslations("media");

  const imageItemMobile = findDTOItemImageBySize(item?.item_images, IMAGES.HEADER.MOBILE.SQUARE.SIZE_FIND_TARGET, 'greater');
  const imageMobile = imageItemMobile || findDTOChannelImageBySize(channel.channel_images, IMAGES.HEADER.MOBILE.SQUARE.SIZE_FIND_TARGET, 'greater');

  const imageItemTablet = findDTOItemImageBySize(item?.item_images, IMAGES.HEADER.TABLET.SQUARE.SIZE_FIND_TARGET, 'greater');
  const imageTablet = imageItemTablet || findDTOChannelImageBySize(channel.channel_images, IMAGES.HEADER.TABLET.SQUARE.SIZE_FIND_TARGET, 'greater');

  const imageItemDesktop = findDTOItemImageBySize(item?.item_images, IMAGES.HEADER.DESKTOP.SQUARE.SIZE_FIND_TARGET, 'greater');
  const imageDesktop = imageItemDesktop || findDTOChannelImageBySize(channel.channel_images, IMAGES.HEADER.DESKTOP.SQUARE.SIZE_FIND_TARGET, 'greater');

  return (
    <div className={styles.headerImageWrapper}>
      <Image
        src={imageMobile?.url}
        alt={channel.title || tMedia("podcast.podcast_image")}
        width={IMAGES.HEADER.MOBILE.SQUARE.SIZE}
        height={IMAGES.HEADER.MOBILE.SQUARE.SIZE}
        className={styles.mobile}
      />
      <Image
        src={imageTablet?.url}
        alt={channel.title || tMedia("podcast.podcast_image")}
        width={IMAGES.HEADER.TABLET.SQUARE.SIZE}
        height={IMAGES.HEADER.TABLET.SQUARE.SIZE}
        className={styles.tablet}
      />
      <Image
        src={imageDesktop?.url}
        alt={channel.title || tMedia("podcast.podcast_image")}
        width={IMAGES.HEADER.DESKTOP.SQUARE.SIZE}
        height={IMAGES.HEADER.DESKTOP.SQUARE.SIZE}
        className={styles.desktop}
      />
    </div>
  );
}

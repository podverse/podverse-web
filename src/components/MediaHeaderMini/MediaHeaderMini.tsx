import React from "react";
import styles from "../../styles/components/MediaHeaderMini/MediaHeaderMini.module.scss";
import { DTOChannel, DTOItem, findDTOChannelImageBySize, findDTOItemImageBySize } from "podverse-helpers";
import Image from "../Image/Image";
import { IMAGES } from "../../constants/images";

type MediaHeaderMiniProps = {
  channel: DTOChannel;
  item?: DTOItem;
}

export const MediaHeaderMini: React.FC<MediaHeaderMiniProps> = ({ channel, item }) => {
  const channel_image = findDTOChannelImageBySize(channel.channel_images, IMAGES.MEDIA_HEADER_MINI.SQUARE.SIZE_FIND_TARGET, 'greater');
  const item_image = findDTOItemImageBySize(item?.item_images, IMAGES.MEDIA_HEADER_MINI.SQUARE.SIZE_FIND_TARGET, 'greater');
  const image_url = item_image?.url || channel_image?.url;

  return (
    <header className={styles.header}>
      <Image
        className={styles.image}
        src={image_url}
        alt={channel.title || ''}
        width={IMAGES.MEDIA_HEADER_MINI.SQUARE.SIZE}
        height={IMAGES.MEDIA_HEADER_MINI.SQUARE.SIZE}
      />
      <div className={styles.textSection}>
        <div className={styles.channelTitle}>{channel.title}</div>
        {item && <div className={styles.itemTitle}>{item.title}</div>}
      </div>
    </header>
  )
}

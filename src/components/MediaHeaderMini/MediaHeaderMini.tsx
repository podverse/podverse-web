import React from "react";
import styles from "../../styles/components/MediaHeaderMini/MediaHeaderMini.module.scss";
import { DTOChannel, DTOItem, DTOItemChapter, DTOItemSoundbite, findDTOChannelImageBySize, findDTOItemImageBySize } from "podverse-helpers";
import Image from "../Image/Image";
import { IMAGES } from "../../constants/images";
import { useTranslations } from "next-intl";

type MediaHeaderMiniProps = {
  channel: DTOChannel;
  item?: DTOItem | null;
  item_chapter?: DTOItemChapter | null;
  item_soundbite?: DTOItemSoundbite | null;
}

export const MediaHeaderMini: React.FC<MediaHeaderMiniProps> = ({ channel, item, item_chapter, item_soundbite }) => {
  const tMisc = useTranslations("misc");
  const channel_image = findDTOChannelImageBySize(channel.channel_images, IMAGES.MEDIA_HEADER_MINI.SQUARE.SIZE_FIND_TARGET, 'greater');
  const item_image = findDTOItemImageBySize(item?.item_images, IMAGES.MEDIA_HEADER_MINI.SQUARE.SIZE_FIND_TARGET, 'greater');
  const image_url = item_image?.url || channel_image?.url;

  let title = "";
  let subtitle = "";

  if (item_soundbite?.title) {
    title = item_soundbite.title || tMisc('untitled');
    subtitle = item?.title || tMisc('untitled');
  } else if (item_chapter?.title) {
    title = item_chapter.title || tMisc('untitled');
    subtitle = item?.title || tMisc('untitled');
  } else if (item?.title) {
    title = item.title || tMisc('untitled');
    subtitle = channel.title || tMisc('untitled');
  }

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
        <div className={styles.title}>{channel.title}</div>
        {item && <div className={styles.subtitle}>{item.title}</div>}
      </div>
    </header>
  )
}

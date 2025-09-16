"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { DTOItem, findDTOItemImageBySize, stripAndDecodeHtml } from "podverse-helpers";
import React from "react";
import Image from "../../../Image/Image";
import { ROUTES } from "../../../../constants/routes";
import styles from "../../../../styles/components/List/Podcasts/Episodes/ListEpisodeRow.module.scss";
import { IMAGES } from "../../../../constants/images";
import { PlayButtonMini } from "../../../MediaPlayer/Buttons/PlayButtonMini";

interface Props {
  item: DTOItem;
}

const ListEpisodeRow: React.FC<Props> = ({ item }) => {
  const url = `${ROUTES.EPISODE}/${item.id_text}`;
  const item_image = findDTOItemImageBySize(item.item_images, IMAGES.LIST.EPISODES.SIZE_FIND_TARGET, 'lesser');
  const tMedia = useTranslations("media");
  
  return (
    <div className={styles.row}>
      <Link href={url} tabIndex={-1}>
        <Image 
          src={item_image?.url}
          alt={item.title || tMedia("podcast.episode_image")}
          width={IMAGES.LIST.EPISODES.SIZE}
          height={IMAGES.LIST.EPISODES.SIZE}
          className={styles.image}
        />
      </Link>
      <div className={styles.content}>
        <Link href={url}>
          <div className={styles.topSection}>
            <h3>{item.title}</h3>
            <p className={styles.description}>{stripAndDecodeHtml(item.item_description.value)}</p>
          </div>
        </Link>
        <div className={styles.bottomSection}>
          <PlayButtonMini />
        </div>
      </div>
    </div>
  );
};

export default ListEpisodeRow;

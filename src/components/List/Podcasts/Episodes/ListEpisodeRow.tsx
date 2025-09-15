"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { DTOItem, findDTOItemImageBySize } from "podverse-helpers";
import React from "react";
import Image from "../../../Image/Image";
import { ROUTES } from "../../../../constants/routes";
import styles from "../../../../styles/components/List/Podcasts/Episodes/ListEpisodeRow.module.scss";
import { IMAGES } from "../../../../constants/images";

interface Props {
  item: DTOItem;
}

const ListEpisodeRow: React.FC<Props> = ({ item }) => {
  const url = `${ROUTES.EPISODE}/${item.id_text}`;
  const item_image = findDTOItemImageBySize(item.item_images, IMAGES.LIST.EPISODES.SIZE_FIND_TARGET, 'lesser');
  const tMedia = useTranslations("media");
  
  return (
    <Link href={url} className={styles.link}>
      <div className={styles.podcastListItem}>
        <Image
          src={item_image?.url}
          alt={item.title || tMedia("podcast.episode_image")}
          width={IMAGES.LIST.EPISODES.SIZE}
          height={IMAGES.LIST.EPISODES.SIZE}
          className={styles.podcastImage}
        />
        <div className={styles.content}>
          <h3 className={styles.title}>{item.title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default ListEpisodeRow;

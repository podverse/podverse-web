"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { DTOItem, findDTOItemImageBySize, formatSecondsToReadableDuration, stripAndDecodeHtml } from "podverse-helpers";
import React from "react";
import Image from "../../../Image/Image";
import { ROUTES } from "../../../../constants/routes";
import styles from "../../../../styles/components/List/Podcasts/Episodes/ListEpisodeRow.module.scss";
import { IMAGES } from "../../../../constants/images";
import { PlayButtonMini } from "../../../MediaPlayer/Buttons/PlayButtonMini";
import { ReadableDuration } from "../../../ReadableDuration/ReadableDuration";
import MoreButton from "../../../MoreButton/MoreButton";

interface Props {
  item: DTOItem;
}

const ListEpisodeRow: React.FC<Props> = ({ item }) => {
  const url = `${ROUTES.EPISODE}/${item.id_text}`;
  const item_image = findDTOItemImageBySize(item.item_images, IMAGES.LIST.EPISODES.SIZE_FIND_TARGET, 'lesser');
  const tMedia = useTranslations("media");

  const moreButtonMenuItems = [
    {
      label: "Hello",
      onClick: () => alert("Hello world!")
    }
  ]

  return (
    <div className={styles.row}>
      <Link href={url} tabIndex={-1}>
        <Image 
          src={item_image?.url}
          alt={item.title || tMedia("podcast.episode_image")}
          width={IMAGES.LIST.EPISODES.DESKTOP.SIZE}
          height={IMAGES.LIST.EPISODES.DESKTOP.SIZE}
          className={styles.image}
        />
        <Image 
          src={item_image?.url}
          alt={item.title || tMedia("podcast.episode_image")}
          width={IMAGES.LIST.EPISODES.MOBILE.SIZE}
          height={IMAGES.LIST.EPISODES.MOBILE.SIZE}
          className={styles.imageMobile}
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
          <div className={styles.bottomSectionStart}>
            <PlayButtonMini />
            <ReadableDuration durationInSeconds={item.item_about.duration || '0'} />
          </div>
          <div className={styles.bottomSectionEnd}>
            <MoreButton moreButtonMenuItems={moreButtonMenuItems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListEpisodeRow;

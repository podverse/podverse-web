"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { DTOChannel, findDTOChannelImageBySize, formatDateAbbrev } from "podverse-helpers";
import React from "react";
import { Image } from "../../Image/Image";
import { ROUTES } from "../../../constants/routes";
import { IMAGES } from "../../../constants/images";
import styles from "../../../styles/components/List/Podcasts/ListPodcastRow.module.scss";

interface Props {
  channel: DTOChannel;
}

const ListPodcastRow: React.FC<Props> = ({ channel }) => {
  const url = `${ROUTES.PODCAST}/${channel.id_text}`;
  const channel_image = findDTOChannelImageBySize(channel.channel_images, IMAGES.LIST.PODCASTS.SIZE_FIND_TARGET, 'lesser');
  const tMedia = useTranslations("media");
  const locale = useLocale();
  
  return (
    <Link href={url} className={styles.link}>
      <div className={styles.listItem}>
        <Image
          src={channel_image?.url}
          alt={channel.title || tMedia("podcast.podcast_image")}
          width={IMAGES.LIST.PODCASTS.SIZE}
          height={IMAGES.LIST.PODCASTS.SIZE}
          className={styles.image}
        />
        <div className={styles.content}>
          {
            channel.channel_about?.last_pub_date && (
              <span className={styles.lastPubDate}>
                {tMedia("updated_with_date", {
                  date: formatDateAbbrev(channel.channel_about.last_pub_date, locale)
                })}
              </span>
            )
          }
          <h3>{channel.title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default ListPodcastRow;

"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { DTOChannel, findDTOChannelImageBySize, formatDateAbbrev } from "podverse-helpers";
import React from "react";
import Image from "../Image/Image";
import { ROUTES } from "../../constants/routes";
import styles from "../../styles/components/List/ListPodcastsItem.module.scss";
import { IMAGE_LIST_PODCASTS_SIZE } from "../../constants/images";

interface Props {
  channel: DTOChannel;
}

const ListPodcastsItem: React.FC<Props> = ({ channel }) => {
  const url = `${ROUTES.PODCAST}/${channel.id_text}`;
  const channel_image = findDTOChannelImageBySize(channel.channel_images, IMAGE_LIST_PODCASTS_SIZE, 'lesser');
  const tMedia = useTranslations("media");
  
  return (
    <Link href={url} className={styles.link}>
      <div className={styles.podcastListItem}>
        <Image
          src={channel_image?.url}
          alt={channel.title || "Podcast Image"}
          width={IMAGE_LIST_PODCASTS_SIZE}
          height={IMAGE_LIST_PODCASTS_SIZE}
          className={styles.podcastImage}
        />
        <div className={styles.content}>
          {
            channel.channel_about?.last_pub_date && (
              <span className={styles.lastPubDate}>
                {tMedia("last_updated", {
                  date: formatDateAbbrev(channel.channel_about.last_pub_date)
                })}
              </span>
            )
          }
          <h3 className={styles.title}>{channel.title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default ListPodcastsItem;

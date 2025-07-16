"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import styles from "../../styles/components/Podcast/PodcastListItem.module.scss";
import { ROUTES } from "../../constants/routes";
import { DTOChannel, formatDateAbbrev } from "podverse-helpers";
import { useTranslations } from "next-intl";

interface Props {
  channel: DTOChannel;
}

const PodcastListItem: React.FC<Props> = ({ channel }) => {
  const url = `${ROUTES.PODCAST}/${channel.id_text}`;
  const imageUrl = channel.channel_images?.[0]?.url;
  const tMedia = useTranslations("media");

  return (
    <Link href={url} className={styles.link}>
      <div className={styles.podcastListItem}>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={channel.title || "Podcast Image"}
            width={80}
            height={80}
            className={styles.podcastImage}
          />
        )}
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

export default PodcastListItem;

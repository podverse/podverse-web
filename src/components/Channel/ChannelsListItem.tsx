"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { DTOChannel, formatDateAbbrev } from "podverse-helpers";
import React from "react";
import Image from "../Image/Image";
import { ROUTES } from "../../constants/routes";
import styles from "../../styles/components/Channel/ChannelsListItem.module.scss";

interface Props {
  channel: DTOChannel;
}

const ChannelListItem: React.FC<Props> = ({ channel }) => {
  const url = `${ROUTES.PODCAST}/${channel.id_text}`;
  const imageUrl = channel.channel_images?.[0]?.url;
  const tMedia = useTranslations("media");
  
  return (
    <Link href={url} className={styles.link}>
      <div className={styles.podcastListItem}>
        <Image
          src={imageUrl}
          alt={channel.title || "Channel Image"}
          width={80}
          height={80}
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

export default ChannelListItem;

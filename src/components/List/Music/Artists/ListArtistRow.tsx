"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { DTOChannel, findDTOChannelImageBySize } from "podverse-helpers";
import React from "react";
import { Image } from "../../../Image/Image";
import { ROUTES } from "../../../../constants/routes";
import { IMAGES } from "../../../../constants/images";
import styles from "../../../../styles/components/List/Podcasts/ListPodcastRow.module.scss";

interface Props {
  channel: DTOChannel;
}

export const ListArtistRow: React.FC<Props> = ({ channel }) => {
  const url = `${ROUTES.ARTIST}/${channel.id_text}`;
  const channel_image = findDTOChannelImageBySize(channel.channel_images, IMAGES.LIST.PODCASTS.SIZE_FIND_TARGET, 'lesser');
  const tMedia = useTranslations("media");
  const tMisc = useTranslations("misc");
  
  return (
    <Link href={url} className={styles.link}>
      <div className={styles.listItem}>
        <Image
          src={channel_image?.url}
          alt={channel.title || tMedia("music.artist_image")}
          width={IMAGES.LIST.ARTISTS.SIZE}
          height={IMAGES.LIST.ARTISTS.SIZE}
          className={styles.image}
        />
        <div className={styles.content}>
          <h3 className={styles.title}>{channel.title}</h3>
          {
            channel.channel_about?.last_pub_date && (
              <span className={styles.lastPubDate}>
                {channel.channel_about?.author || tMisc("untitled")}
              </span>
            )
          }
        </div>
      </div>
    </Link>
  );
};

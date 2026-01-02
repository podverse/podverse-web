"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { PodcastBatchByFeedGuidResponse } from "podverse-helpers";
import React from "react";
import { Image } from "../../../Image/Image";
import { ROUTES } from "../../../../constants/routes";
import { IMAGES } from "../../../../constants/images";
import styles from "../../../../styles/components/List/Podcasts/ListPodcastRow.module.scss";

interface Props {
  channelUnadded: PodcastBatchByFeedGuidResponse['feeds'][number];
}

export const ListAlbumRowRemoteItemUnadded: React.FC<Props> = ({ channelUnadded }) => {
  const url = `${ROUTES.PODCAST_INDEX}/feed/${channelUnadded.id}`;
  const tMedia = useTranslations("media");
  const tMisc = useTranslations("misc");
  
  return (
    <Link href={url} className={styles.link}>
      <div className={styles.listItem}>
        <Image
          src={channelUnadded.image}
          alt={channelUnadded.title || tMedia("music.album_image")}
          width={IMAGES.LIST.ALBUMS.SIZE}
          height={IMAGES.LIST.ALBUMS.SIZE}
          className={styles.image}
        />
        <div className={styles.content}>
          <h3 className={styles.title}>{channelUnadded.title}</h3>
          {
            channelUnadded.author && (
              <span className={styles.lastPubDate}>
                {channelUnadded.author || tMisc("untitled")}
              </span>
            )
          }
        </div>
      </div>
    </Link>
  );
};

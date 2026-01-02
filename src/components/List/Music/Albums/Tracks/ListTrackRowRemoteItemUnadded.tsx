"use client";

import { useTranslations } from "next-intl";
import { EpisodeByGuidResponse } from "podverse-helpers";
import React from "react";
import { Image } from "../../../../Image/Image";
import { ROUTES } from "../../../../../constants/routes";
import { IMAGES } from "../../../../../constants/images";
import { Link } from "../../../../Link/Link";
import styles from "../../../../../styles/components/List/Podcasts/Episodes/ListEpisodeRow.module.scss";

interface Props {
  itemUnadded: NonNullable<EpisodeByGuidResponse['episode']>;
  showChannelInfo?: boolean;
}

export const ListTrackRowRemoteItemUnadded: React.FC<Props> = ({ itemUnadded, showChannelInfo }) => {
  const url = `${ROUTES.PODCAST_INDEX}/feed/${itemUnadded.feedId}`;
  const tMedia = useTranslations("media");
  const tMisc = useTranslations("misc");

  return (
    <div className={styles.trackRow}>
      <Link
        href={url}
        className={styles.trackClickable}>
        <Image 
          src={itemUnadded.image || itemUnadded.feedImage}
          alt={itemUnadded.title || tMedia("music.track_image")}
          width={IMAGES.LIST.TRACKS.DESKTOP.SIZE}
          height={IMAGES.LIST.TRACKS.DESKTOP.SIZE}
          className={styles.image}
        />
        <Image 
          src={itemUnadded.image || itemUnadded.feedImage}
          alt={itemUnadded.title || tMedia("music.track_image")}
          width={IMAGES.LIST.TRACKS.MOBILE.SIZE}
          height={IMAGES.LIST.TRACKS.MOBILE.SIZE}
          className={styles.imageMobile}
        />
        <div className={styles.trackWrapper}>
          <div className={styles.trackContent}>
            <div className={styles.trackTextWrapper}>
              <h3 className={styles.trackTitle}>{itemUnadded.title}</h3>
              {
                showChannelInfo && (
                  <div className={styles.trackArtist}>
                    {itemUnadded.feedTitle || tMisc("untitled")}
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";
import { DTOChannel, DTOItem, DTOLiveItem, findDTOChannelImageBySize, findDTOItemImageBySize,
  getQueryParamFromMediumId } from "podverse-helpers";
import { Image } from "../../Image/Image";
import { ROUTES } from "../../../constants/routes";
import { IMAGES } from "../../../constants/images";
import { LiveItemStatus } from "../../LiveItem/LiveItemStatus";
import { ReadableDate } from "../../Time/ReadableDate";
import { ReadableTime } from "../../Time/ReadableTime";
import styles from "../../../styles/components/List/ListGridNode.module.scss";

interface Props {
  channel: DTOChannel;
  item: DTOItem;
  live_item: DTOLiveItem;
  showChannelInfo?: boolean;
}

export const ListLiveItemGridNode: React.FC<Props> = ({ channel, item, live_item, showChannelInfo }) => {
  const medium = getQueryParamFromMediumId(channel.medium_id) || "av";
  const url = medium === "av" ? `${ROUTES.PODCASTS_LIVESTREAMS}/${item.id_text}` : `${ROUTES.MUSIC_LIVESTREAMS}/${item.id_text}`;
  const channel_image = findDTOChannelImageBySize(channel.channel_images, IMAGES.LIST.LIVESTREAMS.DESKTOP.SIZE_FIND_TARGET, 'lesser');
  const item_image = findDTOItemImageBySize(item.item_images, IMAGES.LIST.LIVESTREAMS.DESKTOP.SIZE_FIND_TARGET, 'lesser');
  const tMedia = useTranslations("media");

  return (
    <Link href={url} className={styles.link}>
      <div className={styles.gridNode}>
        <Image
          src={item_image?.url || channel_image?.url}
          alt={item.title || tMedia("livestream.livestream_image")}
          width={IMAGES.LIST.GRID.SIZE}
          height={IMAGES.LIST.GRID.SIZE}
          className={styles.image}
        />
        <div className={styles.title}>{item.title}</div>
        {showChannelInfo && (
          <div className={styles.channelTitle}>
            {channel?.title}
          </div>
        )}
        <div className={styles.lastPubDate}>
          <ReadableDate date={live_item.start_time} />
          {" • "}
          <ReadableTime
            start={live_item.start_time}
            end={live_item.end_time || null} />
        </div>
      </div>
    </Link>
  );
};

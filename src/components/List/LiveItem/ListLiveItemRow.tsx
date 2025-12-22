"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { DTOChannel, DTOItem, DTOLiveItem, findDTOChannelImageBySize,
  findDTOItemImageBySize, getQueryParamFromQueueMediumId, getShuffleHash, LiveItemStatusEnum,
  stripAndDecodeHtml } from "podverse-helpers";
import React from "react";
import { Image } from "../../Image/Image";
import { LiveItemStatus } from "../../LiveItem/LiveItemStatus";
import { PlayButtonRow } from "../../MediaPlayer/Buttons/PlayButtonRow";
import { ReadableDate } from "../../Time/ReadableDate";
import { ReadableTime } from "../../Time/ReadableTime";
import { ROUTES } from "../../../constants/routes";
import { IMAGES } from "../../../constants/images";
import { getAutoQueueChannelMedium, useAutoQueue } from "../../../contexts/AutoQueue";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { useMediaPlayerResourceUpdate } from "../../../hooks/useMediaPlayerResourceUpdate";
import styles from "../../../styles/components/List/LiveItem/ListLiveItemRow.module.scss";

interface Props {
  channel: DTOChannel;
  item: DTOItem;
  live_item: DTOLiveItem;
  showChannelInfo?: boolean;
  showLiveItemStatus?: boolean
}

export const ListLiveItemRow: React.FC<Props> = ({ channel, item, live_item, showChannelInfo, showLiveItemStatus }) => {
  const medium = getQueryParamFromQueueMediumId(channel.medium_id) || "av";
  const url = medium === "av" ? `${ROUTES.PODCAST_LIVESTREAM}/${item.id_text}` : `${ROUTES.MUSIC_LIVESTREAM}/${item.id_text}`;
  const channel_image = findDTOChannelImageBySize(channel.channel_images, IMAGES.LIST.LIVESTREAMS.DESKTOP.SIZE_FIND_TARGET, 'lesser');
  const item_image = findDTOItemImageBySize(item.item_images, IMAGES.LIST.LIVESTREAMS.DESKTOP.SIZE_FIND_TARGET, 'lesser');
  const tMedia = useTranslations("media");
  const { mpItem, mpIsPlaying, setMPIsPlaying } = useMediaPlayer();
  const mediaPlayerResourceUpdate = useMediaPlayerResourceUpdate();
  const { autoQueueConfig } = useAutoQueue();

  const playButtonOnClick = () => {
    if (item.id_text === mpItem?.id_text) {
      setMPIsPlaying(!mpIsPlaying);
    } else {
      mediaPlayerResourceUpdate({
        shouldPlay: true,
        channel: channel,
        clip: null,
        item: item,
        itemChapter: null,
        itemChapterShouldSeek: false,
        itemSoundbite: null,
        enclosureSelectedParams: 'use-active-item-or-default',
        isPlaying: true,
        skipMoveNowPlayingToHistory: false,
        newAutoQueueConfig: {
          aqmedium: getAutoQueueChannelMedium(channel, null),
          playlist_id_text: null,
          disabled: true,
          random: autoQueueConfig.random,
          repeat: autoQueueConfig.repeat,
          nextPage: 1,
          shuffleHash: getShuffleHash()
        },
        autoQueueShouldClear: true
      });
    }
  };

  return (
    <div className={styles.row}>
      <Link href={url} tabIndex={-1}>
        <Image 
          src={item_image?.url || channel_image?.url}
          alt={item.title || tMedia("livestream.livestream_image")}
          width={IMAGES.LIST.LIVESTREAMS.DESKTOP.SIZE}
          height={IMAGES.LIST.LIVESTREAMS.DESKTOP.SIZE}
          className={styles.image}
        />
        <Image 
          src={item_image?.url || channel_image?.url}
          alt={item.title || tMedia("livestream.livestream_image")}
          width={IMAGES.LIST.LIVESTREAMS.MOBILE.SIZE}
          height={IMAGES.LIST.LIVESTREAMS.MOBILE.SIZE}
          className={styles.imageMobile}
        />
      </Link>
      <div className={styles.content}>
        <Link href={url}>
          <div className={styles.topSection}>
            <h3>{item.title}</h3>
              <div className={styles.subtitle}>
                {
                  !showChannelInfo && stripAndDecodeHtml(item.item_description?.value)
                }
                {
                  showChannelInfo && channel.title
                }
              </div>
          </div>
        </Link>
        <div className={styles.bottomSection}>
          <div className={styles.bottomSectionStart}>
            {
              live_item.live_item_status.id === LiveItemStatusEnum.Live && (
                <PlayButtonRow
                  item={item}
                  onClick={playButtonOnClick}
                />
              )
            }
            {
              showLiveItemStatus && (
                <LiveItemStatus live_item={live_item} />
              )
            }
            <div className={styles.timeSection}>
              <ReadableDate date={live_item.start_time} />
              {" • "}
              <ReadableTime
                start={live_item.start_time}
                end={live_item.end_time || null} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

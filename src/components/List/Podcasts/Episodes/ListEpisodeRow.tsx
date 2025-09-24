"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { DTOChannel, DTOItem, findDTOChannelImageBySize, findDTOItemImageBySize, stripAndDecodeHtml } from "podverse-helpers";
import React from "react";
import Image from "../../../Image/Image";
import { ROUTES } from "../../../../constants/routes";
import styles from "../../../../styles/components/List/Podcasts/Episodes/ListEpisodeRow.module.scss";
import { IMAGES } from "../../../../constants/images";
import { PlayButtonMini } from "../../../MediaPlayer/Buttons/PlayButtonMini";
import { ReadableDuration } from "../../../Time/ReadableDuration";
import MoreButton from "../../../MoreButton/MoreButton";
import { useMediaPlayer } from "../../../../contexts/MediaPlayer";
import { ReadableDate } from "../../../Time/ReadableDate";
import { TimeSeparator } from "../../../Time/TimeSeparator";

interface Props {
  channel: DTOChannel;
  item: DTOItem;
}

const ListEpisodeRow: React.FC<Props> = ({ channel, item }) => {
  const url = `${ROUTES.EPISODE}/${item.id_text}`;
  const channel_image = findDTOChannelImageBySize(channel.channel_images, IMAGES.LIST.EPISODES.DESKTOP.SIZE_FIND_TARGET, 'lesser');
  const item_image = findDTOItemImageBySize(item.item_images, IMAGES.LIST.EPISODES.DESKTOP.SIZE_FIND_TARGET, 'lesser');
  const tFeatures = useTranslations("features");
  const tMedia = useTranslations("media");
  const tMediaPlayer = useTranslations("media_player");
  const { setMPChannel, mpItem, setMPItem, setMPClip, mpIsPlaying, setMPIsPlaying } = useMediaPlayer();

  const moreButtonMenuItems = [
    {
      label: tMediaPlayer("play"),
      onClick: () => alert(tMediaPlayer("play"))
    },
    {
      label: tFeatures("queue.queue_next"),
      onClick: () => alert(tFeatures("queue.queue_next"))
    },
    {
      label: tFeatures("queue.queue_last"),
      onClick: () => alert(tFeatures("queue.queue_last"))
    },
    {
      label: tFeatures("playlist.add_to_playlist"),
      onClick: () => alert(tFeatures("playlist.add_to_playlist"))
    },
    {
      label: tFeatures("share"),
      onClick: () => alert(tFeatures("share"))
    },
    {
      label: tFeatures("history.mark_as_played"),
      onClick: () => alert(tFeatures("history.mark_as_played"))
    },
    {
      label: tFeatures("download.download_episode"),
      onClick: () => alert(tFeatures("download.download_episode"))
    }
  ]

  const playButtonOnClick = () => {
    if (item.id === mpItem?.id) {
      setMPIsPlaying(!mpIsPlaying);
    } else {
      setMPChannel(channel);
      setMPItem(item);
      setMPClip(null);
      setMPIsPlaying(true);
    }
  };

  return (
    <div className={styles.row}>
      <Link href={url} tabIndex={-1}>
        <Image 
          src={item_image?.url || channel_image?.url}
          alt={item.title || tMedia("podcast.episode_image")}
          width={IMAGES.LIST.EPISODES.DESKTOP.SIZE}
          height={IMAGES.LIST.EPISODES.DESKTOP.SIZE}
          className={styles.image}
        />
        <Image 
          src={item_image?.url || channel_image?.url}
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
            <p className={styles.description}>
              {stripAndDecodeHtml(item.item_description?.value)}
            </p>
          </div>
        </Link>
        <div className={styles.bottomSection}>
          <div className={styles.bottomSectionStart}>
            <PlayButtonMini
              item={item}
              onClick={playButtonOnClick}
            />
            <div className={styles.timeSection}>
              <ReadableDate date={item.pub_date} />
              <TimeSeparator />
              <ReadableDuration durationInSeconds={item.item_about.duration || null} />
            </div>
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

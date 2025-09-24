"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { DTOChannel, DTOClip, DTOItem, findDTOChannelImageBySize, findDTOItemImageBySize } from "podverse-helpers";
import React from "react";
import Image from "../../Image/Image";
import { ROUTES } from "../../../constants/routes";
import styles from "../../../styles/components/List/Clips/ListClipRow.module.scss";
import { IMAGES } from "../../../constants/images";
import { PlayButtonMini } from "../../MediaPlayer/Buttons/PlayButtonMini";
import MoreButton from "../../MoreButton/MoreButton";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { ReadableDate } from "../../Time/ReadableDate";
import { TimeSeparator } from "../../Time/TimeSeparator";
import { ReadableTimeRange } from "../../Time/ReadableTimeRange";
import { useAccount } from "../../../contexts/Account";

interface Props {
  channel?: DTOChannel;
  item?: DTOItem;
  clip: DTOClip;
}

export const ListClipRow: React.FC<Props> = ({ channel, item, clip }) => {
  const url = `${ROUTES.CLIP}/${clip.id_text}`;

  const channel_images = channel?.channel_images || clip?.item?.channel?.channel_images;
  const item_images = item?.item_images || clip?.item?.item_images;
  const channel_image = findDTOChannelImageBySize(channel_images, IMAGES.LIST.CLIPS.SIZE_FIND_TARGET, 'lesser');
  const item_image = findDTOItemImageBySize(item_images, IMAGES.LIST.CLIPS.SIZE_FIND_TARGET, 'lesser');

  const tFeatures = useTranslations("features");
  const tMedia = useTranslations("media");
  const tMediaPlayer = useTranslations("media_player");
  const tMisc = useTranslations("misc");
  const { setMPChannel, mpClip, setMPItem, setMPClip, mpIsPlaying, setMPIsPlaying } = useMediaPlayer();
  const { loggedInAccount } = useAccount();

  const clipTitle = clip.title || tMisc("untitled");
  const itemTitle = item?.title || clip?.item?.title || tMisc("untitled");
  const itemPubDate = item?.pub_date || clip?.item?.pub_date;

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
    }
  ]

  if (loggedInAccount?.id_text === clip.account?.id_text) {
    moreButtonMenuItems.push({
      label: tFeatures("clip.edit_clip"),
      onClick: () => {
        window.location.href = `${ROUTES.CLIP}/edit/${clip.id_text}`;
      }
    });
  }

  const playButtonOnClick = () => {
    if (clip.id === mpClip?.id) {
      setMPIsPlaying(!mpIsPlaying);
    } else {
      setMPChannel(channel || null);
      setMPItem(item || null);
      setMPClip(clip);
      setMPIsPlaying(true);
    }
  };

  return (
    <div className={styles.row}>
      <Link href={url} tabIndex={-1}>
        <Image 
          src={item_image?.url || channel_image?.url}
          alt={itemTitle || tMedia("podcast.episode_image")}
          width={IMAGES.LIST.CLIPS.SIZE}
          height={IMAGES.LIST.CLIPS.SIZE}
          className={styles.image}
        />
        <Image 
          src={item_image?.url || channel_image?.url}
          alt={itemTitle || tMedia("podcast.episode_image")}
          width={IMAGES.LIST.CLIPS.SIZE}
          height={IMAGES.LIST.CLIPS.SIZE}
          className={styles.imageMobile}
        />
      </Link>
      <div className={styles.content}>
        <Link href={url}>
          <div className={styles.topSection}>
            <h3 className={styles.clipTitle}>{clipTitle}</h3>
            <p className={styles.itemTitle}>{itemTitle}</p>
          </div>
        </Link>
        <div className={styles.bottomSection}>
          <div className={styles.bottomSectionStart}>
            <PlayButtonMini
              clip={clip}
              item={item || clip.item}
              onClick={playButtonOnClick}
            />
            <div className={styles.timeSection}>
              <ReadableDate date={itemPubDate} />
              <TimeSeparator />
              <ReadableTimeRange
                startTime={clip.start_time}
                endTime={clip.end_time} />
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

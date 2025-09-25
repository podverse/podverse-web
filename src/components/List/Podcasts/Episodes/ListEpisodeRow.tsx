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
import { useModals } from "../../../../contexts/Modals";
import { getQueueForMedium } from "../../../../utils/queue";
import { useQueues } from "../../../../contexts/Queue";
import { apiRequestService } from "../../../../factories/apiRequestService";
import { showToastPromise } from "../../../Toast/Toast";

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
  const { queues } = useQueues();
  const { setMPChannel, mpItem, setMPItem, setMPClip, mpIsPlaying, setMPIsPlaying } = useMediaPlayer();
  const { setModalPlaylistAddTo } = useModals();

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

  const addToPlaylistOnClick = () => {
    setModalPlaylistAddTo({
      channel: channel,
      item: item,
      clip: null,
      item_chapter: null,
      item_soundbite: null
    });
  }

  const addToQueueNextOnClick = async () => {
    const queue = getQueueForMedium(queues, channel.medium_id);
    if (queue) {
      showToastPromise(
        apiRequestService.reqQueueResourceItemAddNext(queue.id_text, item.id_text),
        {
          success: tFeatures("queue.added_to_queue"),
          error: tFeatures("queue.add_error")
        }
      );
    }
  }

  const addToQueueLastOnClick = async () => {
    const queue = getQueueForMedium(queues, channel.medium_id);
    if (queue) {
      showToastPromise(
        apiRequestService.reqQueueResourceItemAddLast(queue.id_text, item.id_text),
        {
          success: tFeatures("queue.added_to_queue"),
          error: tFeatures("queue.add_error")
        }
      );
    }
  }

  const moreButtonMenuItems = [
    {
      label: tMediaPlayer("play"),
      onClick: playButtonOnClick
    },
    {
      label: tFeatures("queue.queue_next"),
      onClick: addToQueueNextOnClick
    },
    {
      label: tFeatures("queue.queue_last"),
      onClick: addToQueueLastOnClick
    },
    {
      label: tFeatures("playlist.add_to_playlist"),
      onClick: addToPlaylistOnClick
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

"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { DTOChannel, DTOItem, findDTOChannelImageBySize, findDTOItemImageBySize,
  getSelectedItemEnclosureUrl, stripAndDecodeHtml } from "podverse-helpers";
import React from "react";
import Image from "../../../Image/Image";
import { ROUTES } from "../../../../constants/routes";
import styles from "../../../../styles/components/List/Podcasts/Episodes/ListEpisodeRow.module.scss";
import { IMAGES } from "../../../../constants/images";
import { PlayButtonRow } from "../../../MediaPlayer/Buttons/PlayButtonRow";
import { ReadableDuration } from "../../../Time/ReadableDuration";
import { MoreButton } from "../../../MoreButton/MoreButton";
import { useMediaPlayer } from "../../../../contexts/MediaPlayer";
import { ReadableDate } from "../../../Time/ReadableDate";
import { useModals } from "../../../../contexts/Modals";
import { getQueueForMedium } from "../../../../utils/queue";
import { useQueues } from "../../../../contexts/Queue";
import { apiRequestService } from "../../../../factories/apiRequestService";
import { showToastPromise, showToastPromiseWithLoading } from "../../../Toast/Toast";
import { downloadAndSaveFile } from "../../../../utils/fileDownloader";

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
  const { setMPChannel, mpItem, setMPItem, setMPClip, mpIsPlaying,
    setMPIsPlaying, setMPItemChapter, setMPItemChapterShouldSeek,
    setMPItemSoundbite, setMPShouldPlay } = useMediaPlayer();
  const { setModalPlaylistAddTo } = useModals();

  const playButtonOnClick = () => {
    if (item.id === mpItem?.id) {
      setMPIsPlaying(!mpIsPlaying);
    } else {
      setMPShouldPlay(true);
      setMPChannel(channel);
      setMPClip(null);
      setMPItem(item);
      setMPItemChapter(null);
      setMPItemChapterShouldSeek(false);
      setMPItemSoundbite(null);
      setMPIsPlaying(true);
    }
  };

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

  const addToPlaylistOnClick = () => {
    setModalPlaylistAddTo({
      channel: channel,
      item: item,
      clip: null,
      item_chapter: null,
      item_soundbite: null
    });
  }

  const markAsPlayedOnClick = async () => {
    const queue = getQueueForMedium(queues, channel.medium_id);
    if (queue) {
      showToastPromise(
        apiRequestService.reqQueueResourceItemAddHistory(
          queue.id_text,
          item.id_text, {
            completed: true
          }
        ),
        {
          success: tFeatures("history.marked_as_played"),
          error: tFeatures("history.mark_as_played_error")
        }
      );
    }
  }

  const downloadEpisode = async () => {
    const selectedItemEnclosureUrl = getSelectedItemEnclosureUrl(item.item_enclosures);
    if (selectedItemEnclosureUrl) {
      showToastPromiseWithLoading(
        downloadAndSaveFile(selectedItemEnclosureUrl, item.title || 'episode.mp3'),
        {
          loading: tFeatures("download.downloading_episode"),
          success: tFeatures("download.episode_downloaded"),
          error: tFeatures("download.download_error")
        }
      )
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
      onClick: markAsPlayedOnClick
    },
    {
      label: tFeatures("download.download_episode"),
      onClick: downloadEpisode
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
            <PlayButtonRow
              item={item}
              onClick={playButtonOnClick}
            />
            <div className={styles.timeSection}>
              <ReadableDate date={item.pub_date} />
              {item.item_about?.duration ? " • " : null}
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

"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { DTOChannel, DTOItem, findDTOChannelImageBySize, findDTOItemImageBySize,
  getQueueForMedium, 
  getShuffleHash} from "podverse-helpers";
import React from "react";
import { FaGripLines } from "react-icons/fa6";
import { Image } from "../../../../Image/Image";
import { ROUTES } from "../../../../../constants/routes";
import { IMAGES } from "../../../../../constants/images";
import { MoreButton, MoreButtonMenuItem } from "../../../../MoreButton/MoreButton";
import { useMediaPlayer } from "../../../../../contexts/MediaPlayer";
import { useModals } from "../../../../../contexts/Modals";
import { useQueues } from "../../../../../contexts/Queue";
import { apiRequestService } from "../../../../../factories/apiRequestService";
import { showToastPromise, showToastPromiseWithLoading } from "../../../../Toast/Toast";
import { downloadAndSaveFile } from "../../../../../utils/fileDownloader";
import { useMediaPlayerResourceUpdate } from "../../../../../hooks/useMediaPlayerResourceUpdate";
import { useAutoQueue } from "../../../../../contexts/AutoQueue";
import { useAccount } from "../../../../../contexts/Account";
import { downloadTrackWithModal } from "../../../../../utils/downloadModal/downloadTrackWithModal";
import { Button } from "../../../../Button/Button";
import styles from "../../../../../styles/components/List/Podcasts/Episodes/ListEpisodeRow.module.scss";

interface Props {
  channel: DTOChannel;
  item: DTOItem;
  showChannelInfo?: boolean;
  isEditModeQueue?: boolean;
  removeFromQueue?: () => void;
  isEditModePlaylist?: boolean;
  removeFromPlaylist?: () => void;
  playlist_id_text: string | null;
}

export const ListTrackRow: React.FC<Props> = ({ channel, isEditModeQueue, item,
  showChannelInfo, removeFromQueue, isEditModePlaylist, removeFromPlaylist,
  playlist_id_text }) => {
  const router = useRouter();
  const url = `${ROUTES.TRACK}/${item.id_text}`;
  const imageSizeTarget = IMAGES.LIST.TRACKS.DESKTOP.SIZE_FIND_TARGET;
  const channel_image = findDTOChannelImageBySize(channel.channel_images, imageSizeTarget, 'lesser');
  const item_image = findDTOItemImageBySize(item.item_images, imageSizeTarget, 'lesser');
  const tFeatures = useTranslations("features");
  const tMedia = useTranslations("media");
  const tMediaPlayer = useTranslations("media_player");
  const tInstructions = useTranslations("instructions");
  const { queues } = useQueues();
  const { loggedInAccount } = useAccount();
  const { mpItem, mpIsPlaying, setMPIsPlaying } = useMediaPlayer();
  const mediaPlayerResourceUpdate = useMediaPlayerResourceUpdate();
  const { setModalPlaylistAddTo, setModalSourceSelector, setModalLoginRequired } = useModals();
  const { autoQueueConfig } = useAutoQueue();

  const playButtonOnClick = () => {
    if (item.id === mpItem?.id) {
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
          playlist_id_text,
          disabled: false,
          random: autoQueueConfig.random,
          repeat: autoQueueConfig.repeat,
          nextPage: 1,
          shuffleHash: getShuffleHash()
        },
        autoQueueShouldClear: true
      });
    }
  };

  const addToQueueNextOnClick = async () => {
    if (!loggedInAccount) {
      setModalLoginRequired({
        title: null,
        message: tInstructions("login_to_add_to_queue")
      })
      return;
    }

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
    if (!loggedInAccount) {
      setModalLoginRequired({
        title: null,
        message: tInstructions("login_to_add_to_queue")
      })
      return;
    }

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
    if (!loggedInAccount) {
      setModalLoginRequired({
        title: null,
        message: tInstructions("login_to_add_to_playlist")
      })
      return;
    }

    setModalPlaylistAddTo({
      channel: channel,
      item: item,
      clip: null,
      item_soundbite: null
    });
  }

  const goToTrackPage = () => {
    router.push(url);
  }

  const downloadTrack = async () => {
    downloadTrackWithModal({
      item,
      setModalSourceSelector,
      tFeatures,
      showToastPromiseWithLoading,
      downloadAndSaveFile
    });
  }

  const removeFromQueueOnClick = async () => {
    const queue = getQueueForMedium(queues, channel.medium_id);

    async function handler () {
      if (queue) {
        await apiRequestService.reqQueueResourceItemDelete(queue.id_text, item.id_text);
        removeFromQueue?.();
      }
    }

    showToastPromise(
      handler,
      {
        success: tFeatures("queue.removed_from_queue"),
        error: tFeatures("queue.remove_error")
      }
    );
  }

  const removeFromPlaylistOnClick = async () => {
    async function handler () {
      if (playlist_id_text) {
        await apiRequestService.reqPlaylistResourceItemDelete(playlist_id_text, item.id_text);
        removeFromPlaylist?.();
      }
    }

    showToastPromise(
      handler,
      {
        success: tFeatures("playlist.removed_from_playlist"),
        error: tFeatures("playlist.remove_error")
      }
    );
  }

  const moreButtonMenuItems: MoreButtonMenuItem[] = [
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
      label: tMedia("music.track_go_to"),
      onClick: goToTrackPage
    },
    {
      label: tFeatures("download.download_track"),
      onClick: downloadTrack
    }
  ]

  if (isEditModeQueue) {
    moreButtonMenuItems.push({
      label: tFeatures("queue.remove_from_queue"),
      onClick: removeFromQueueOnClick,
      variant: "danger"
    });
  }

  if (isEditModePlaylist) {
    moreButtonMenuItems.push({
      label: tFeatures("playlist.remove_from_playlist"),
      onClick: removeFromPlaylistOnClick,
      variant: "danger"
    });
  }

  return (
    <div className={styles.trackRow}>
      {
        (isEditModeQueue || isEditModePlaylist) && (
          <div className={styles.editingButtons}>
            <FaGripLines />
          </div>
        )
      }
      <Button
        variant="unstyled"
        onClick={playButtonOnClick}
        className={styles.trackClickable}>
        <Image 
          src={item_image?.url || channel_image?.url}
          alt={item.title || tMedia("music.track_image")}
          width={IMAGES.LIST.TRACKS.DESKTOP.SIZE}
          height={IMAGES.LIST.TRACKS.DESKTOP.SIZE}
          className={styles.image}
        />
        <Image 
          src={item_image?.url || channel_image?.url}
          alt={item.title || tMedia("music.track_image")}
          width={IMAGES.LIST.TRACKS.MOBILE.SIZE}
          height={IMAGES.LIST.TRACKS.MOBILE.SIZE}
          className={styles.imageMobile}
        />
        <div className={styles.trackWrapper}>
          <div className={styles.trackContent}>
            <div className={styles.trackTextWrapper}>
              <h3 className={styles.trackTitle}>{item.title}</h3>
              {
                showChannelInfo && (
                  <div className={styles.trackArtist}>
                    {channel.title}
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </Button>
      <MoreButton moreButtonMenuItems={moreButtonMenuItems} />
    </div>
  );
};

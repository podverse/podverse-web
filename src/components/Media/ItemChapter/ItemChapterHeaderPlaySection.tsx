"use client";

import { useTranslations } from "next-intl";
import { DTOChannel, DTOItem, DTOItemChapter, getSelectedItemEnclosureUrl } from "podverse-helpers";
import React from "react";
import { PlayButtonLarge } from "../../MediaPlayer/Buttons/PlayButtonLarge";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { ReadableDate } from "../../Time/ReadableDate";
import { MoreButton } from "../../MoreButton/MoreButton";
import { showToastPromiseWithLoading } from "../../Toast/Toast";
import { downloadAndSaveFile } from "../../../utils/fileDownloader";
import { useMediaPlayerResourceUpdate } from "../../../hooks/useMediaPlayerResourceUpdate";
import { getAutoQueueChannelMedium } from "../../../contexts/AutoQueue";
import { ReadableTimeRange } from "../../Time/ReadableTimeRange";
import styles from "../../../styles/components/Media/ItemChapter/ItemChapterHeaderPlaySection.module.scss";

type ItemChapterHeaderPlaySectionProps = {
  channel: DTOChannel;
  item: DTOItem;
  item_chapter: DTOItemChapter;
};

export const ItemChapterHeaderPlaySection: React.FC<ItemChapterHeaderPlaySectionProps> = ({ item_chapter, item, channel }) => {
  const tFeatures = useTranslations("features");
  const tMediaPlayer = useTranslations("media_player");
  const { mpItemChapter, mpIsPlaying, setMPIsPlaying } = useMediaPlayer();
  const mediaPlayerResourceUpdate = useMediaPlayerResourceUpdate();

  const playButtonOnClick = () => {
    if (item_chapter.id_text === mpItemChapter?.id_text) {
      setMPIsPlaying(!mpIsPlaying);
    } else {
      mediaPlayerResourceUpdate({
        shouldPlay: true,
        channel: channel,
        clip: null,
        item,
        itemChapter: item_chapter,
        itemChapterShouldSeek: true,
        itemSoundbite: null,
        enclosureRowSelected: 'use-active-item-or-default',
        isPlaying: true,
        skipMoveNowPlayingToHistory: false,
        newAutoQueueConfig: {
          aqmedium: getAutoQueueChannelMedium(channel),
          playlist_id_text: null
        },
        autoQueueShouldClear: true
      });
    }
  };

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
      label: tFeatures("download.download_episode"),
      onClick: downloadEpisode
    }
  ]

  return (
    <div className={styles.playSection}>
      <div className={styles.sectionStart}>
        <PlayButtonLarge
          item_chapter={item_chapter}
          onClick={playButtonOnClick}
        />
        <div className={styles.timeSection}>
          <ReadableDate date={item.pub_date} />
          {item.item_about?.duration ? " • " : null}
          <ReadableTimeRange
            startTime={item_chapter.start_time}
            endTime={item_chapter.end_time}
          />
        </div>
      </div>
      <div className={styles.sectionEnd}>
        <MoreButton
          moreButtonMenuItems={moreButtonMenuItems}
          isLarge />
      </div>
    </div>
  )
};

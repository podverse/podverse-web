"use client";

import { DTOChannel, DTOItem, getShuffleHash } from "podverse-helpers";
import React from "react";
import { PlayButtonLarge } from "../../MediaPlayer/Buttons/PlayButtonLarge";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { ReadableDate } from "../../Time/ReadableDate";
import { useMediaPlayerResourceUpdate } from "../../../hooks/useMediaPlayerResourceUpdate";
import { useAutoQueue } from "../../../contexts/AutoQueue";
import { ReadableTime } from "../../Time/ReadableTime";
import { LiveItemStatus } from "../../LiveItem/LiveItemStatus";
import styles from "../../../styles/components/Media/Podcast/Episode/EpisodeHeaderPlaySection.module.scss";

type LivestreamHeaderPlaySectionProps = {
  item: DTOItem;
  channel: DTOChannel;
};

export const LivestreamHeaderPlaySection: React.FC<LivestreamHeaderPlaySectionProps> = ({ item, channel }) => {
  const { mpItem, mpClip, mpItemSoundbite, mpIsPlaying, setMPIsPlaying } = useMediaPlayer();
  const mediaPlayerResourceUpdate = useMediaPlayerResourceUpdate();
  const { autoQueueConfig } = useAutoQueue();
  
  const playButtonOnClick = () => {
    if (
      item.id === mpItem?.id
      && !mpClip
      && !mpItemSoundbite
    ) {
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
        isPlaying: true,
        enclosureSelectedParams: 'use-active-item-or-default',
        skipMoveNowPlayingToHistory: false,
        newAutoQueueConfig: {
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
    <div className={styles.playSection}>
      <div className={styles.sectionStart}>
        <PlayButtonLarge
          item={item}
          onClick={playButtonOnClick}
        />
        {
          item.live_item && (
            <>
              <LiveItemStatus live_item={item.live_item} />
              <div className={styles.timeSection}>
                <ReadableDate date={item.live_item.start_time} />
                {" • "}
                <ReadableTime
                  start={item.live_item.start_time}
                  end={item.live_item.end_time || null} />
              </div>
            </>
          )
        }
      </div>
    </div>
  )
};

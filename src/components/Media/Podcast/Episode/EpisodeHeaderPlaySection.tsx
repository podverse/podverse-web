"use client";

import { DTOChannel, DTOItem } from "podverse-helpers";
import React from "react";
import { PlayButtonHeader } from "../../../MediaPlayer/Buttons/PlayButtonHeader";
import { useMediaPlayer } from "../../../../contexts/MediaPlayer";
import styles from "../../../../styles/components/Media/Podcast/Episode/EpisodeHeaderPlaySection.module.scss";

type EpisodeHeaderPlaySectionProps = {
  item: DTOItem;
  channel: DTOChannel;
};

export const EpisodeHeaderPlaySection: React.FC<EpisodeHeaderPlaySectionProps> = ({ item, channel }) => {
  const { setMPChannel, mpItem, setMPItem, setMPClip, mpIsPlaying,
    setMPIsPlaying } = useMediaPlayer();
  
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
    <div className={styles.playSection}>
      <PlayButtonHeader
        item={item}
        onClick={playButtonOnClick}
      />
    </div>
  )
};

"use client";

import { DTOItem } from "podverse-helpers";
import React from "react";
import { PlayButtonLarge } from "../../../MediaPlayer/Buttons/PlayButtonLarge";
import { useMediaPlayer } from "../../../../contexts/MediaPlayer";
import styles from "../../../../styles/components/Media/Podcast/Episode/EpisodeHeaderPlaySection.module.scss";

type EpisodeHeaderPlaySectionProps = {
  item: DTOItem;
};

export const EpisodeHeaderPlaySection: React.FC<EpisodeHeaderPlaySectionProps> = ({ item }) => {
  const { setMPChannel, mpItem, setMPItem, setMPClip, mpIsPlaying,
    setMPIsPlaying } = useMediaPlayer();
  
  const playButtonOnClick = () => {
    if (item.id === mpItem?.id) {
      setMPIsPlaying(!mpIsPlaying);
    } else if (item.channel) {
      setMPChannel(item.channel);
      setMPItem(item);
      setMPClip(null);
      setMPIsPlaying(true);
    }
  };

  return (
    <div className={styles.playSection}>
      <PlayButtonLarge
        item={item}
        onClick={playButtonOnClick}
      />
    </div>
  )
};

import { DTOChannel, DTOClip, DTOItem, DTOItemChapter, DTOItemSoundbite } from "podverse-helpers";
import React from "react";
import { PodcastHeaderViewDesktop } from "./PodcastHeaderViewDesktop";
import { PodcastHeaderViewTablet } from "./PodcastHeaderViewTablet";
import styles from "../../../styles/components/Media/Podcast/PodcastHeader.module.scss";

type PodcastHeaderProps = {
  channel: DTOChannel;
  item?: DTOItem;
  clip?: DTOClip;
  item_soundbite?: DTOItemSoundbite;
  item_chapter?: DTOItemChapter;
};

export const PodcastHeader: React.FC<PodcastHeaderProps> = ({ channel, item, clip, item_soundbite, item_chapter }) => {
  return (
    <header className={styles.header}>
      <PodcastHeaderViewDesktop channel={channel} item={item} clip={clip} item_soundbite={item_soundbite} item_chapter={item_chapter} />
      <PodcastHeaderViewTablet channel={channel} item={item} clip={clip} item_soundbite={item_soundbite} item_chapter={item_chapter} />
    </header>
  )
};

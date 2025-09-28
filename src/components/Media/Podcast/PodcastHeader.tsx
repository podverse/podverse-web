import { DTOChannel, DTOItem } from "podverse-helpers";
import React from "react";
import { PodcastHeaderViewDesktop } from "./PodcastHeaderViewDesktop";
import { PodcastHeaderViewTablet } from "./PodcastHeaderViewTablet";
import styles from "../../../styles/components/Media/Podcast/PodcastHeader.module.scss";

type PodcastHeaderProps = {
  channel: DTOChannel;
  item?: DTOItem;
};

export const PodcastHeader: React.FC<PodcastHeaderProps> = ({ channel, item }) => {
  return (
    <header className={styles.header}>
      <PodcastHeaderViewDesktop channel={channel} item={item} />
      <PodcastHeaderViewTablet channel={channel} item={item} />
    </header>
  )
};

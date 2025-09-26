import { DTOChannel } from "podverse-helpers";
import React from "react";
import { PodcastHeaderViewDesktop } from "./PodcastHeaderViewDesktop";
import { PodcastHeaderViewTablet } from "./PodcastHeaderViewTablet";
import styles from "../../../styles/components/Media/Podcast/PodcastHeader.module.scss";

type PodcastHeaderProps = {
  channel: DTOChannel;
};

export const PodcastHeader: React.FC<PodcastHeaderProps> = ({ channel }) => {
  return (
    <header className={styles.header}>
      <PodcastHeaderViewDesktop channel={channel} />
      <PodcastHeaderViewTablet channel={channel} />
    </header>
  )
};

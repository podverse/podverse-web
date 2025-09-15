import { DTOChannel } from "podverse-helpers";
import React from "react";

import styles from "../../../styles/app/podcast/PodcastHeader.module.scss";
import { PodcastHeaderViewDesktop } from "./PodcastHeaderViewDesktop";
import { PodcastHeaderViewTablet } from "./PodcastHeaderViewTablet";

type PodcastHeaderProps = {
  channel: DTOChannel;
};

const PodcastHeader: React.FC<PodcastHeaderProps> = ({ channel }) => {
  return (
    <header className={styles.header}>
      <PodcastHeaderViewDesktop channel={channel} />
      <PodcastHeaderViewTablet channel={channel} />
    </header>
  )
};

export default PodcastHeader;

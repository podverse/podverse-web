import { DTOChannel } from "podverse-helpers";
import React from "react";

import styles from "../../../styles/app/podcast/PodcastHeader.module.scss";
import { PodcastHeaderDesktop } from "./PodcastHeaderDesktop";

type PodcastHeaderProps = {
  channel: DTOChannel;
};

const PodcastHeader: React.FC<PodcastHeaderProps> = ({ channel }) => {
  return (
    <header className={styles.header}>
      <PodcastHeaderDesktop channel={channel} />
    </header>
  )
};

export default PodcastHeader;

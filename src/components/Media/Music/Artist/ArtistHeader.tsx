import { DTOChannel } from "podverse-helpers";
import React from "react";
import { ArtistHeaderViewDesktop } from "./ArtistHeaderViewDesktop";
import { ArtistHeaderViewTablet } from "./ArtistHeaderViewTablet";
import styles from "../../../../styles/components/Media/Podcast/PodcastHeader.module.scss";

type ArtistHeaderProps = {
  channel: DTOChannel;
};

export const ArtistHeader: React.FC<ArtistHeaderProps> = ({ channel }) => {
  return (
    <header className={styles.header}>
      <ArtistHeaderViewDesktop channel={channel} />
      <ArtistHeaderViewTablet channel={channel} />
    </header>
  )
};

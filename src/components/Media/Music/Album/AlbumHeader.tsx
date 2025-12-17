import { DTOChannel, DTOItem } from "podverse-helpers";
import React from "react";
import { AlbumHeaderViewDesktop } from "./AlbumHeaderViewDesktop";
import { AlbumHeaderViewTablet } from "./AlbumHeaderViewTablet";
import styles from "../../../../styles/components/Media/Podcast/PodcastHeader.module.scss";

type AlbumHeaderProps = {
  channel: DTOChannel;
  item?: DTOItem;
};

export const AlbumHeader: React.FC<AlbumHeaderProps> = ({ channel, item }) => {
  return (
    <header className={styles.header}>
      <AlbumHeaderViewDesktop channel={channel} item={item} />
      <AlbumHeaderViewTablet channel={channel} item={item} />
    </header>
  )
};

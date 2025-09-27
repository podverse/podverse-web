import { DTOChannel, DTOItem } from "podverse-helpers";
import React from "react";
import styles from "../../../../styles/components/Media/Podcast/Episode/EpisodeHeader.module.scss";
import { Divider } from "../../../Divider/Divider";
import { EpisodeHeaderPlaySection } from "./EpisodeHeaderPlaySection";

type EpisodeHeaderProps = {
  item: DTOItem;
  channel: DTOChannel;
};

export const EpisodeHeader: React.FC<EpisodeHeaderProps> = ({ item, channel }) => {
  return (
    <header>
      <h2 className={styles.title}>{item.title || "Untitled"}</h2>
      <EpisodeHeaderPlaySection item={item} channel={channel} />
      <Divider className={styles.divider} />
    </header>
  )
};

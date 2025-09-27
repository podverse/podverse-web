import { DTOItem } from "podverse-helpers";
import React from "react";
import styles from "../../../../styles/components/Media/Podcast/Episode/EpisodeHeader.module.scss";
import { Divider } from "../../../Divider/Divider";
import { EpisodeHeaderPlaySection } from "./EpisodeHeaderPlaySection";

type EpisodeHeaderProps = {
  item: DTOItem;
};

export const EpisodeHeader: React.FC<EpisodeHeaderProps> = ({ item }) => {  
  return (
    <header>
      <h2 className={styles.title}>{item.title || "Untitled"}</h2>
      <EpisodeHeaderPlaySection item={item} />
      <Divider className={styles.divider} />
    </header>
  )
};

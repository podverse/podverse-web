import { DTOChannel, DTOItem } from "podverse-helpers";
import React from "react";
import styles from "../../../../styles/components/Media/Podcast/Episode/EpisodeHeader.module.scss";
import { Divider } from "../../../Divider/Divider";
import { EpisodeHeaderPlaySection } from "./EpisodeHeaderPlaySection";
import Link from "../../../Link/Link";
import { ROUTES } from "../../../../constants/routes";

type EpisodeHeaderProps = {
  item: DTOItem;
  channel: DTOChannel;
};

export const EpisodeHeader: React.FC<EpisodeHeaderProps> = ({ item, channel }) => {
  return (
    <header>
      <Link href={`${ROUTES.EPISODE}/${item.id_text}`}>
        <h2 className={styles.episodeTitle}>{item.title || "Untitled"}</h2>
      </Link>
      <EpisodeHeaderPlaySection item={item} channel={channel} />
      <Divider className={styles.divider} />
    </header>
  )
};

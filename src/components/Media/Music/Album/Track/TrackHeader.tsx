import { DTOChannel, DTOItem } from "podverse-helpers";
import React from "react";
import { Divider } from "../../../../Divider/Divider";
import { TrackHeaderPlaySection } from "./TrackHeaderPlaySection";
import { Link } from "../../../../Link/Link";
import { ROUTES } from "../../../../../constants/routes";
import styles from "../../../../../styles/components/Media/Podcast/Episode/EpisodeHeader.module.scss";

type TrackHeaderProps = {
  item: DTOItem;
  channel: DTOChannel;
};

export const TrackHeader: React.FC<TrackHeaderProps> = ({ item, channel }) => {
  return (
    <header>
      <Link href={`${ROUTES.TRACK}/${item.id_text}`}>
        <h2 className={styles.episodeTitle}>{item.title || "Untitled"}</h2>
      </Link>
      <TrackHeaderPlaySection item={item} channel={channel} />
      <Divider className={styles.divider} />
    </header>
  )
};

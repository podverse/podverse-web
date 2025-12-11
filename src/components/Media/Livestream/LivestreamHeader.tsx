import { DTOChannel, DTOItem, QueryParamsQueueMedium } from "podverse-helpers";
import React from "react";
import { Divider } from "../../Divider/Divider";
import { LivestreamHeaderPlaySection } from "./LivestreamHeaderPlaySection";
import { Link } from "../../Link/Link";
import { ROUTES } from "../../../constants/routes";
import styles from "../../../styles/components/Media/Podcast/Episode/EpisodeHeader.module.scss";

type LivestreamHeaderProps = {
  item: DTOItem;
  channel: DTOChannel;
  medium: QueryParamsQueueMedium;
};

export const LivestreamHeader: React.FC<LivestreamHeaderProps> = ({ item, channel, medium }) => {
  const link = medium === "av" ? `${ROUTES.PODCAST_LIVESTREAM}/${item.id_text}` : `${ROUTES.MUSIC_LIVESTREAM}/${item.id_text}`;
  return (
    <header>
      <Link href={link}>
        <h2 className={styles.episodeTitle}>{item.title || "Untitled"}</h2>
      </Link>
      <LivestreamHeaderPlaySection item={item} channel={channel} />
      <Divider className={styles.divider} />
    </header>
  )
};

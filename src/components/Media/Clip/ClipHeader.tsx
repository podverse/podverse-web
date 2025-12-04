import { DTOChannel, DTOClip, DTOItem } from "podverse-helpers";
import React from "react";
import { ClipHeaderPlaySection } from "./ClipHeaderPlaySection";
import { Link } from "../../Link/Link";
import { ROUTES } from "../../../constants/routes";
import styles from "../../../styles/components/Media/Clip/ClipHeader.module.scss";

type ClipHeaderProps = {
  clip: DTOClip;
  item: DTOItem;
  channel: DTOChannel;
};

export const ClipHeader: React.FC<ClipHeaderProps> = ({ clip, item, channel }) => {
  return (
    <header>
      <Link href={`${ROUTES.EPISODE}/${item.id_text}`}>
        <h2 className={styles.episodeTitle}>{item.title || "Untitled"}</h2>
      </Link>
      <h3 className={styles.clipTitle}>{clip.title || "Untitled"}</h3>
      <ClipHeaderPlaySection item={item} channel={channel} clip={clip} />
    </header>
  )
};

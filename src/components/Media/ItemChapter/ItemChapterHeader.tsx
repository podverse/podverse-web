import { DTOChannel, DTOItem, DTOItemChapter } from "podverse-helpers";
import React from "react";
import Link from "../../Link/Link";
import { ROUTES } from "../../../constants/routes";
import { ItemChapterHeaderPlaySection } from "./ItemChapterHeaderPlaySection";
import styles from "../../../styles/components/Media/ItemChapter/ItemChapterHeader.module.scss";

type ItemChapterHeaderProps = {
  channel: DTOChannel;
  item: DTOItem;
  item_chapter: DTOItemChapter;
};

export const ItemChapterHeader: React.FC<ItemChapterHeaderProps> = ({ item_chapter, item, channel }) => {
  return (
    <header>
      <Link href={`${ROUTES.EPISODE}/${item.id_text}`}>
        <h2 className={styles.episodeTitle}>{item.title || "Untitled"}</h2>
      </Link>
      <h3 className={styles.officialItemChapterTitle}>{item_chapter.title || "Untitled"}</h3>
      <ItemChapterHeaderPlaySection item={item} channel={channel} item_chapter={item_chapter} />
    </header>
  )
};

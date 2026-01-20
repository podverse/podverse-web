"use client";

import { DTOChannel, DTOItem, DTOItemChapter } from "podverse-helpers";
import React from "react";
import Pagination from "../../Pagination/Pagination";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { scrollMainToTop } from "../../../utils/scroll";
import { ListItemChapterRow } from "./ListItemChapterRow";

type ListItemChaptersProps = {
  page: number;
  setPage: (page: number) => void;
  channel: DTOChannel;
  item: DTOItem;
  item_chapters: DTOItemChapter[];
  totalPages: number;
};

export const ListItemChapters: React.FC<ListItemChaptersProps> = ({
  page, setPage, channel, item, item_chapters, totalPages }) => {

  useSkipInitialEffect(() => {
    scrollMainToTop();
  }, [item_chapters]);

  return (
    <Pagination
      currentPage={page}
      totalPages={totalPages}
      setPage={setPage}>
      {item_chapters.map((item_chapter) => (
        <ListItemChapterRow
          key={item_chapter.id}
          channel={channel}
          item={item}
          item_chapter={item_chapter} />
      ))}
    </Pagination>
  );
};

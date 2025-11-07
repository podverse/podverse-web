import { DTOChannel, DTOItem, DTOItemChapter } from "podverse-helpers";
import React from "react";
import { MainWrapper } from "../../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../../components/Main/MainInnerContentWrapper";
import { PodcastHeader } from "../../../components/Media/Podcast/PodcastHeader";
import { SideContent } from "../../../components/SideContent/SideContent";
import { ItemChapterHeader } from "../../../components/Media/ItemChapter/ItemChapterHeader";

interface ChapterClientProps {
  ssrChannel: DTOChannel;
  ssrItem: DTOItem;
  ssrItemChapter: DTOItemChapter;
}

export function ChapterClient(props: ChapterClientProps) {
  const { ssrChannel, ssrItem, ssrItemChapter } = props;

  return (
    <MainWrapper>
      <PodcastHeader channel={ssrChannel} item={ssrItem} item_chapter={ssrItemChapter} />
      <MainInnerWrapper>
        <SideContent />
        <MainInnerContentWrapper>
          <ItemChapterHeader channel={ssrChannel} item={ssrItem} item_chapter={ssrItemChapter} />
        </MainInnerContentWrapper>
      </MainInnerWrapper>
    </MainWrapper>
  );
}

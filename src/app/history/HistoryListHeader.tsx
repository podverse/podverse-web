"use client";

import { useTranslations } from "next-intl";
import { getMediumFromQueryParam, MediumEnum } from "podverse-helpers";
import React from "react";
import { ListHeader } from "../../components/List/ListHeader";
import { useHistoryPageContext } from "./HistoryPageContext";
import { ButtonTabs } from "../../components/Tabs/ButtonTabs";

export const HistoryListHeader: React.FC = () => {
  const { filterParams, setFilterParams } = useHistoryPageContext();
  const tMedia = useTranslations('media');

  const belowButtons = [
    {
      key: MediumEnum.Podcast,
      label: tMedia("podcast.podcasts"),
      onClick: () => setFilterParams({ ...filterParams, medium: "podcasts" })
    },
    {
      key: MediumEnum.Video,
      label: tMedia("video.videos"),
      onClick: () => setFilterParams({ ...filterParams, medium: "videos" })
    },
    {
      key: MediumEnum.Music,
      label: tMedia("music.music"),
      onClick: () => setFilterParams({ ...filterParams, medium: "music" })
    }
  ]

  return (
    <ListHeader
      belowButtons={(
        <ButtonTabs
          buttonTabs={belowButtons}
          selectedKey={getMediumFromQueryParam(filterParams.medium) ?? MediumEnum.Podcast}
        />
      )}
    />
  );
};

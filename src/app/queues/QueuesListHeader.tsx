"use client";

import { useTranslations } from "next-intl";
import { MediumEnum } from "podverse-helpers";
import React from "react";
import { ListHeader } from "../../components/List/ListHeader";
import { useQueuesPageContext } from "./QueuesPageContext";
import { ButtonTabs } from "../../components/Tabs/ButtonTabs";

export const QueuesListHeader: React.FC = () => {
  const { filterParams, setFilterParams } = useQueuesPageContext();
  const { medium_id } = filterParams;
  const tMedia = useTranslations('media');

  const belowButtons = [
    {
      key: MediumEnum.Podcast,
      label: tMedia("podcast.podcasts"),
      onClick: () => setFilterParams({ ...filterParams, medium_id: MediumEnum.Podcast })
    },
    {
      key: MediumEnum.Video,
      label: tMedia("video.videos"),
      onClick: () => setFilterParams({ ...filterParams, medium_id: MediumEnum.Video })
    },
    {
      key: MediumEnum.Music,
      label: tMedia("music.music"),
      onClick: () => setFilterParams({ ...filterParams, medium_id: MediumEnum.Music })
    }
  ]

  return (
    <ListHeader
      belowButtons={(
        <ButtonTabs
          buttonTabs={belowButtons}
          selectedKey={medium_id ?? MediumEnum.Podcast}
        />
      )}
    />
  );
};

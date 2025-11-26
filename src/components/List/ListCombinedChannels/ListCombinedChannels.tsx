"use client";

import { DTOChannel, QueryParamsMedium } from "podverse-helpers";
import React from "react";
import Pagination from "../../Pagination/Pagination";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { scrollMainToTop } from "../../../utils/scroll";
import { ViewSelectedOption } from "../../ViewSelector/ViewSelector";
import styles from "../../../styles/components/List/Podcasts/ListPodcasts.module.scss";
import { ListPodcastNodes } from "../Podcasts/ListPodcastNodes";

type ListCombinedChannelsProps = {
  page: number;
  setPage: (page: number) => void;
  channels: DTOChannel[];
  totalPages: number;
  medium: QueryParamsMedium
  viewSelected: ViewSelectedOption;
};

export const ListCombinedChannels: React.FC<ListCombinedChannelsProps> = ({
  page, setPage, channels, totalPages, medium, viewSelected }) => {
  
  useSkipInitialEffect(() => {
    scrollMainToTop();
  }, [channels]);
  
  let listNodes: React.ReactNode = null;
  
  if (medium === 'all' || medium === 'podcasts') {
    listNodes = ListPodcastNodes({ channels, viewSelected });
  } else if (medium === 'videos') {
    listNodes = ListPodcastNodes({ channels, viewSelected });
  } else if (medium === 'music') {
    listNodes = ListPodcastNodes({ channels, viewSelected });
  }

  return (
    <Pagination
      currentPage={page}
      maxButtons={5}
      totalPages={totalPages}
      setPage={setPage}
      paginationControlsClassName={styles.paginationControls}>
      {listNodes}
    </Pagination>
  );
};

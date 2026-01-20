"use client";

import { DTOChannel, QueryParamsMedium } from "podverse-helpers";
import React from "react";
import Pagination from "../../Pagination/Pagination";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { scrollMainToTop } from "../../../utils/scroll";
import { ViewSelectedOption } from "../../ViewSelector/ViewSelector";
import { ListCombinedChannelNodes } from "./ListCombinedChannelNodes";
import styles from "../../../styles/components/List/Podcasts/ListPodcasts.module.scss";

type ListCombinedChannelsProps = {
  page: number;
  setPage: (page: number) => void;
  channels: DTOChannel[];
  totalPages: number;
  filterMedium: QueryParamsMedium
  viewSelected: ViewSelectedOption;
};

export const ListCombinedChannels: React.FC<ListCombinedChannelsProps> = ({
  page, setPage, channels, totalPages, filterMedium, viewSelected }) => {
  
  useSkipInitialEffect(() => {
    scrollMainToTop();
  }, [channels]);
  
  const listNodes = ListCombinedChannelNodes({ channels, viewSelected, filterMedium });

  return (
    <Pagination
      currentPage={page}
      totalPages={totalPages}
      setPage={setPage}
      paginationControlsClassName={styles.paginationControls}>
      {listNodes}
    </Pagination>
  );
};

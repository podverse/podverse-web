"use client";

import React from "react";
import { usePodcastContext } from "./PodcastContext";
import LoadingSpinnerOverlay from "../../../components/LoadingSpinner/LoadingSpinnerOverlay";
import ListEpisodes from "../../../components/List/Podcasts/Episodes/ListEpisodes";

const PodcastList: React.FC = () => {
  const { filterParams, setFilterParams, items, totalPages, isLoading, showSubscribeMessage } = usePodcastContext();
  const { page = 1, type } = filterParams;

  console.log("type", type, totalPages);

  return (
    <>
      <ListEpisodes
        page={page}
        setPage={(page) => setFilterParams({ ...filterParams, page })}
        items={items}
        totalPages={totalPages}
        showSubscribeMessage={showSubscribeMessage}
      />
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </>
  );
};

export default PodcastList;

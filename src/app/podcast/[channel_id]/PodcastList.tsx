"use client";

import React from "react";
import { usePodcastContext } from "./PodcastContext";
import LoadingSpinnerOverlay from "../../../components/LoadingSpinner/LoadingSpinnerOverlay";
import ListEpisodes from "../../../components/List/Podcasts/Episodes/ListEpisodes";
import styles from "../../../styles/app/podcast/PodcastList.module.scss";

const PodcastList: React.FC = () => {
  const { filterParams, setFilterParams, items, totalPages, isLoading, showSubscribeMessage } = usePodcastContext();
  const { page = 1 } = filterParams;

  return (
    <div className={styles.list}>
      <ListEpisodes
        page={page}
        setPage={(page) => setFilterParams({ ...filterParams, page })}
        items={items}
        totalPages={totalPages}
        showSubscribeMessage={showSubscribeMessage}
      />
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </div>
  );
};

export default PodcastList;

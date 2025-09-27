"use client";

import React from "react";
import { useEpisodeContext } from "./EpisodeContext";
import LoadingSpinnerOverlay from "../../../components/LoadingSpinner/LoadingSpinnerOverlay";
import styles from "../../../styles/app/podcast/PodcastList.module.scss";
import { EpisodeSummary } from "../../../components/Media/Episode/EpisodeSummary";

export const EpisodeList: React.FC = () => {
  const { filterParams, isLoading, item } = useEpisodeContext();
  const { type } = filterParams;
  
  return (
    <div className={styles.list}>
      {
        type === "summary" && (
          <EpisodeSummary description={item.item_description?.value} />
        )
      }
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </div>
  );
};

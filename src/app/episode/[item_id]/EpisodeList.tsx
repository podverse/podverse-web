"use client";

import React from "react";
import { useEpisodeContext } from "./EpisodeContext";
import LoadingSpinnerOverlay from "../../../components/LoadingSpinner/LoadingSpinnerOverlay";
import styles from "../../../styles/app/podcast/PodcastList.module.scss";

export const EpisodeList: React.FC = () => {
  const { filterParams, isLoading } = useEpisodeContext();
  const { type } = filterParams;
  
  return (
    <div className={styles.list}>
      {
        type === "summary" && (
          <div>hello summary</div>
        )
      }
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </div>
  );
};

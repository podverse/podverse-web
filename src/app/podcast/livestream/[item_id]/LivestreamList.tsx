"use client";

import React from "react";
import { DTOItem } from "podverse-helpers";
import { useLivestreamContext } from "./LivestreamContext";
import LoadingSpinnerOverlay from "../../../../components/LoadingSpinner/LoadingSpinnerOverlay";
import { EpisodeSummary } from "../../../../components/Media/Podcast/Episode/EpisodeSummary";
import styles from "../../../../styles/app/podcast/PodcastList.module.scss";

type LivestreamListProps = {
  ssrItem: DTOItem;
}

export const LivestreamList: React.FC<LivestreamListProps> = ({ ssrItem }) => {
  const { filterParams, isLoading } = useLivestreamContext();
  const { type } = filterParams;

  return (
    <div className={styles.list}>
      {
        type === "summary" && (
          <EpisodeSummary description={ssrItem.item_description?.value} />
        )
      }
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </div>
  );
};

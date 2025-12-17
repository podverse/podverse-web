"use client";

import React from "react";
import { DTOItem } from "podverse-helpers";
import { useTrackContext } from "./TrackContext";
import LoadingSpinnerOverlay from "../../../components/LoadingSpinner/LoadingSpinnerOverlay";
import { EpisodeSummary } from "../../../components/Media/Podcast/Episode/EpisodeSummary";
import { ItemTranscript } from "../../../components/ItemTranscript/ItemTranscript";
import styles from "../../../styles/app/podcast/PodcastList.module.scss";

type TrackListProps = {
  ssrItem: DTOItem;
}

export const TrackList: React.FC<TrackListProps> = ({ ssrItem }) => {
  const { filterParams, isLoading, transcriptRows, autoScrollOn } = useTrackContext();
  const { type } = filterParams;

  return (
    <div className={styles.list}>
      {
        type === "summary" && (
          <EpisodeSummary description={ssrItem.item_description?.value} />
        )
      }
      {
        type === "transcript" && (
          <ItemTranscript
            autoScrollOn={autoScrollOn}
            rows={transcriptRows} />
        )
      }
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </div>
  );
};

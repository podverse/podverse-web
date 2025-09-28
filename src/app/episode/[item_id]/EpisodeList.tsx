"use client";

import React from "react";
import { useEpisodeContext } from "./EpisodeContext";
import LoadingSpinnerOverlay from "../../../components/LoadingSpinner/LoadingSpinnerOverlay";
import styles from "../../../styles/app/podcast/PodcastList.module.scss";
import { EpisodeSummary } from "../../../components/Media/Podcast/Episode/EpisodeSummary";
import { ListClips } from "../../../components/List/Clips/ListClips";
import { DTOChannel, DTOItem } from "podverse-helpers";

type EpisodeListProps = {
  ssrChannel: DTOChannel;
  ssrItem: DTOItem;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({ ssrChannel, ssrItem }) => {
  const { filterParams, setFilterParams, isLoading, clips, totalPages } = useEpisodeContext();
  const { page = 1, type } = filterParams;

  return (
    <div className={styles.list}>
      {
        type === "summary" && (
          <EpisodeSummary description={ssrItem.item_description?.value} />
        )
      }
      {
        type === "clips" && (
          <ListClips
            page={page}
            setPage={(page) => setFilterParams({ ...filterParams, page })}
            clips={clips}
            channel={ssrChannel}
            item={ssrItem}
            totalPages={totalPages}
            showSubscribeMessage={false}
          />
        )
      }
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </div>
  );
};

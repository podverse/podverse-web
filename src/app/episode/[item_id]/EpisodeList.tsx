"use client";

import React from "react";
import { useEpisodeContext } from "./EpisodeContext";
import LoadingSpinnerOverlay from "../../../components/LoadingSpinner/LoadingSpinnerOverlay";
import styles from "../../../styles/app/podcast/PodcastList.module.scss";
import { EpisodeSummary } from "../../../components/Media/Podcast/Episode/EpisodeSummary";
import { ListClips } from "../../../components/List/Clips/ListClips";
import { DTOChannel, DTOItem } from "podverse-helpers";
import { ListItemSoundbites } from "../../../components/List/ItemSoundbites/ListItemSoundbites";
import { ListItemChapters } from "../../../components/List/ItemChapters/ListItemChapters";

type EpisodeListProps = {
  ssrChannel: DTOChannel;
  ssrItem: DTOItem;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({ ssrChannel, ssrItem }) => {
  const { filterParams, setFilterParams, isLoading, clips, itemChapters, itemSoundbites, totalPages } = useEpisodeContext();
  const { page = 1, type } = filterParams;

  return (
    <div className={styles.list}>
      {
        type === "summary" && (
          <EpisodeSummary description={ssrItem.item_description?.value} />
        )
      }
      {
        type === "chapters" && (
          <ListItemChapters
            page={page}
            setPage={(page) => setFilterParams({ ...filterParams, page })}
            item_chapters={itemChapters}
            channel={ssrChannel}
            item={ssrItem}
            totalPages={totalPages}
          />
        )
      }
      {
        type === "soundbites" && (
          <ListItemSoundbites
            page={page}
            setPage={(page) => setFilterParams({ ...filterParams, page })}
            itemSoundbites={itemSoundbites}
            channel={ssrChannel}
            item={ssrItem}
            totalPages={totalPages}
            showSubscribeMessage={false}
          />
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

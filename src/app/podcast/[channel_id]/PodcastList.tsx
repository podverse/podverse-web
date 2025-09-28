"use client";

import { DTOChannel, DTOPodroll } from "podverse-helpers";
import React from "react";
import { usePodcastContext } from "./PodcastContext";
import LoadingSpinnerOverlay from "../../../components/LoadingSpinner/LoadingSpinnerOverlay";
import ListEpisodes from "../../../components/List/Podcasts/Episodes/ListEpisodes";
import { ContentAbout } from "../../../components/Content/About/ContentAbout";
import { ContentPodroll } from "../../../components/Content/Podroll/ContentPodroll";
import styles from "../../../styles/app/podcast/PodcastList.module.scss";
import { ListClips } from "../../../components/List/Clips/ListClips";

type PodcastListProps = {
  podroll?: DTOPodroll | null;
  ssrChannel: DTOChannel;
}

export const PodcastList: React.FC<PodcastListProps> = ({ podroll, ssrChannel }) => {
  const { filterParams, setFilterParams, items, clips, totalPages,
    isLoading } = usePodcastContext();
  const { page = 1 } = filterParams;

  const { type } = filterParams;

  return (
    <div className={styles.list}>
      {
        type === "episodes" && (
          <ListEpisodes
            page={page}
            setPage={(page) => setFilterParams({ ...filterParams, page })}
            channel={ssrChannel}
            items={items}
            totalPages={totalPages}
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
            totalPages={totalPages}
            showFullInfo={true}
          />
        )
      }
      {
        type === "about" && (
          <ContentAbout
            description={ssrChannel.channel_description?.value}
            channel_persons={ssrChannel.channel_persons}
          />
        )
      }
      {
        type === "podroll" && (
          <ContentPodroll podroll={podroll} />
        )
      }
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </div>
  );
};

"use client";

import { DTOPodroll } from "podverse-helpers";
import React from "react";
import { usePodcastContext } from "./PodcastContext";
import LoadingSpinnerOverlay from "../../../components/LoadingSpinner/LoadingSpinnerOverlay";
import ListEpisodes from "../../../components/List/Podcasts/Episodes/ListEpisodes";
import { ContentAbout } from "../../../components/Content/About/ContentAbout";
import { ContentPodroll } from "../../../components/Content/Podroll/ContentPodroll";
import styles from "../../../styles/app/podcast/PodcastList.module.scss";

type PodcastListProps = {
  podroll?: DTOPodroll | null;
}

const PodcastList: React.FC<PodcastListProps> = ({ podroll }) => {
  const { filterParams, setFilterParams, channel, items, totalPages, isLoading, showSubscribeMessage } = usePodcastContext();
  const { page = 1 } = filterParams;

  const { type } = filterParams;

  return (
    <div className={styles.list}>
      {
        type === "episodes" && (
          <ListEpisodes
            page={page}
            setPage={(page) => setFilterParams({ ...filterParams, page })}
            channel={channel}
            items={items}
            totalPages={totalPages}
            showSubscribeMessage={showSubscribeMessage}
          />
        )
      }
      {
        type === "about" && (
          <ContentAbout
            description={channel.channel_description?.value}
            channel_persons={channel.channel_persons}
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

export default PodcastList;

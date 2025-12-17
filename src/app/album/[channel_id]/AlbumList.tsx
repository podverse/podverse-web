"use client";

import { DTOChannel, DTOPodroll } from "podverse-helpers";
import React from "react";
import { useAlbumContext } from "./AlbumContext";
import LoadingSpinnerOverlay from "../../../components/LoadingSpinner/LoadingSpinnerOverlay";
import { ListTracks } from "../../../components/List/Music/Albums/Tracks/ListTracks";
import { ContentAbout } from "../../../components/Content/About/ContentAbout";
import { ContentPodroll } from "../../../components/Content/Podroll/ContentPodroll";
import { AlbumSettings } from "../../../components/List/Music/Albums/AlbumSettings";
import styles from "../../../styles/app/podcast/PodcastList.module.scss";

type AlbumListProps = {
  podroll?: DTOPodroll | null;
  ssrChannel: DTOChannel;
}

export const AlbumList: React.FC<AlbumListProps> = ({ podroll, ssrChannel }) => {
  const { filterParams, setFilterParams, items, totalPages, isLoading } = useAlbumContext();
  const { page, type } = filterParams;
  
  return (
    <div className={styles.list}>
      {
        type === "tracks" && (
          <ListTracks
            page={page}
            setPage={(page) => setFilterParams({ ...filterParams, page })}
            channel={ssrChannel}
            items={items}
            totalPages={totalPages}
            viewSelected="rows"
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
      {
        type === "settings" && (
          <AlbumSettings channel={ssrChannel} />
        )
      }
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </div>
  );
};

"use client";

import React, { useRef } from "react";
import PodcastListItem from "./PodcastListItem";
import Pagination from "../Pagination/Pagination";
import { useSkipInitialEffect } from "../../hooks/useSkipInitialEffect";
import { usePodcastsContext } from "../../app/podcasts/PodcastsContext";

const PodcastList: React.FC = () => {
  const { page = 1, setPage, channels, totalPages } = usePodcastsContext();
  const topRef = useRef<HTMLDivElement>(null);

  useSkipInitialEffect(() => {
    topRef?.current?.scrollIntoView();
  }, [channels]);

  return (
    <>
      <div ref={topRef} />
      <Pagination
        currentPage={page}
        maxButtons={5}
        totalPages={totalPages}
        onPageChange={setPage}>
        {channels.map((channel) => (
          <PodcastListItem key={channel.id} channel={channel} />
        ))}
      </Pagination>
    </>
  );
};

export default PodcastList;
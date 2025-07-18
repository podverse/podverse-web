"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  DTOChannel,
  QUERY_PARAMS_CHANNELS_TYPE_VALUES,
  QUERY_PARAMS_CHANNELS_SORT_VALUES,
  QUERY_PARAMS_STATS_RANGE_VALUES,
  QueryParamChannels
} from "podverse-helpers";
import React, { useRef } from "react";
import PodcastListItem from "./PodcastListItem";
import LoadingSpinnerOverlay from "../LoadingSpinner/LoadingSpinnerOverlay";
import Pagination from "../Pagination/Pagination";
import { useLoadingSpinnerGlobal } from "../../contexts/LoadingGlobal";
import { useSkipInitialEffect } from "../../hooks/useSkipInitialEffect";

function getValidatedChannelParams(searchParams: ReturnType<typeof useSearchParams>): QueryParamChannels {
  const rawSort = searchParams.get("sort")?.toString();
  const sort = QUERY_PARAMS_CHANNELS_SORT_VALUES.includes(rawSort as typeof QUERY_PARAMS_CHANNELS_SORT_VALUES[number])
    ? (rawSort as typeof QUERY_PARAMS_CHANNELS_SORT_VALUES[number])
    : undefined;
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const rawType = searchParams.get("type")?.toString();
  const type = QUERY_PARAMS_CHANNELS_TYPE_VALUES.includes(rawType as typeof QUERY_PARAMS_CHANNELS_TYPE_VALUES[number])
    ? (rawType as typeof QUERY_PARAMS_CHANNELS_TYPE_VALUES[number])
    : undefined;
  const rawRange = searchParams.get("range")?.toString();
  const range = QUERY_PARAMS_STATS_RANGE_VALUES.includes(rawRange as typeof QUERY_PARAMS_STATS_RANGE_VALUES[number])
    ? (rawRange as typeof QUERY_PARAMS_STATS_RANGE_VALUES[number])
    : undefined;
  const category = searchParams.get("category")?.toString();
  return {
    ...(page ? { page } : {}),
    ...(sort ? { sort } : {}),
    ...(type ? { type } : {}),
    ...(range ? { range } : {}),
    ...(category ? { category } : {})
  };
}

interface PodcastListProps {
  ssrChannels: DTOChannel[];
}

const PodcastList: React.FC<PodcastListProps> = ({ ssrChannels }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const validatedParams = getValidatedChannelParams(searchParams);
  const currentPage = validatedParams.page ?? 1;

  const { isLoadingGlobal, setIsLoadingGlobal } = useLoadingSpinnerGlobal();

  const topRef = useRef<HTMLDivElement>(null);

  useSkipInitialEffect(() => {
    topRef?.current?.scrollIntoView();
    setIsLoadingGlobal(false);
  }, [ssrChannels]);

  const handlePageChange = (page: number) => {
    setIsLoadingGlobal(true);
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <>
      <div ref={topRef} />
      {isLoadingGlobal && <LoadingSpinnerOverlay />}
      <Pagination
        currentPage={currentPage}
        maxButtons={5}
        totalPages={20}
        onPageChange={handlePageChange}>
        {ssrChannels.map((channel) => (
          <PodcastListItem key={channel.id} channel={channel} />
        ))}
      </Pagination>
    </>
  );
};

export default PodcastList;
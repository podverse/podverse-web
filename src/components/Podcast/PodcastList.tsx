"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import PodcastListItem from "./PodcastListItem";
import Pagination from "../Pagination/Pagination";
import { apiRequestService } from "../../factories/apiRequestService";
import LoadingSpinnerOverlay from "../LoadingSpinner/LoadingSpinnerOverlay";
import { DTOChannel } from "podverse-helpers";
import { useSkipInitialEffect } from "../../hooks/useSkipInitialEffect";
import { useSearchParams } from "next/navigation";

interface PodcastListProps {
  ssrChannels: DTOChannel[];
  ssrPage?: number;
}

const PodcastList: React.FC<PodcastListProps> = ({ ssrChannels, ssrPage }) => {
  const [channels, setChannels] = useState<DTOChannel[]>(ssrChannels);
  const [totalPages, setTotalPages] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort")?.toString() ?? "recent";
  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);

  const topRef = useRef<HTMLDivElement>(null);

  useSkipInitialEffect(() => {
    const fetchChannels = async () => {
      setIsLoading(true);
      const response = await apiRequestService.reqChannelGetMany({
        page: currentPage,
        sort
      });
      setChannels(response?.data ?? []);
      // setTotalPages(totalPages);
      setIsLoading(false);
    };
    fetchChannels();
  }, [currentPage, sort]);

  useEffect(() => {
    if (!isLoading && topRef.current) {
      topRef.current.scrollIntoView();
    }
  }, [isLoading]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <>
      <div ref={topRef} />
      {isLoading && <LoadingSpinnerOverlay />}
      <Pagination
        currentPage={currentPage}
        maxButtons={5}
        totalPages={totalPages}
        onPageChange={handlePageChange}>
        {channels.map((channel) => (
          <PodcastListItem key={channel.id} channel={channel} />
        ))}
      </Pagination>
    </>
  );
};

export default PodcastList;
"use client";

import React, { useState } from "react";
import PodcastListItem from "./PodcastListItem";
import Pagination from "../Pagination/Pagination";
import { apiRequestService } from "../../factories/apiRequestService";
import LoadingSpinnerOverlay from "../LoadingSpinner/LoadingSpinnerOverlay";
import { DTOChannel } from "podverse-helpers";
import { useSkipInitialEffect } from "../../hooks/useSkipInitialEffect";

interface PodcastListProps {
  ssrChannels: DTOChannel[];
  ssrPage?: number;
}

const PodcastList: React.FC<PodcastListProps> = ({ ssrChannels, ssrPage }) => {
  const [channels, setChannels] = useState<DTOChannel[]>(ssrChannels);
  const [currentPage, setCurrentPage] = useState(ssrPage || 1);
  const [totalPages, setTotalPages] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  
  useSkipInitialEffect(() => {
    const fetchChannels = async () => {
      setIsLoading(true);
      const response = await apiRequestService.reqChannelGetMany({ page: currentPage });
      setChannels(response?.data ?? []);
      // setTotalPages(totalPages);
      setIsLoading(false);
    };
    fetchChannels();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
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
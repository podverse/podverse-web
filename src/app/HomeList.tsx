"use client";

import React from "react";
import { ListCombinedChannels } from "../components/List/ListCombinedChannels/ListCombinedChannels";
import LoadingSpinnerOverlay from "../components/LoadingSpinner/LoadingSpinnerOverlay";
import { useHomeContext } from "./HomeContext";
import { useAccount } from "../contexts/Account";
import { useLocalSettings } from "../contexts/LocalSettings";
import { HowToStartInfo } from "../components/InfoWrapper/HowToStartInfo";

export const HomeList: React.FC = () => {
  const { filterParams, setFilterParams, channels, totalPages, isLoading } = useHomeContext();
  const { loggedInAccount } = useAccount();
  const { viewSelected } = useLocalSettings();
  const { page, medium } = filterParams;

  return (
    <>
      <HowToStartInfo
        rows={channels}
        totalPages={totalPages}
      />
      {
        (loggedInAccount && channels.length !== 0) && (
          <ListCombinedChannels
            page={page}
            setPage={(page) => setFilterParams({ ...filterParams, page })}
            channels={channels}
            totalPages={totalPages}
            filterMedium={medium}
            viewSelected={viewSelected}
          />
        )
      }
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </>
  );
};

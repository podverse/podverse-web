"use client";

import { useParams } from "next/navigation";
import { QueryParamsChannelMusicArtist } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { checkBackNavFlag } from "../../../contexts/Navigation";
import { usePageStateCache } from "../../../hooks/usePageStateCache";
import { getPageState } from "../../../utils/pageStateCache";

interface ArtistContextType {
  filterParams: QueryParamsChannelMusicArtist;
  setFilterParams: (params: QueryParamsChannelMusicArtist) => void;
};

const ArtistContext = createContext<ArtistContextType | undefined>(undefined);

interface ArtistContextProviderProps {
  children: ReactNode,
  initialQueryParams: QueryParamsChannelMusicArtist
}

export const ArtistContextProvider = ({
  children,
  initialQueryParams
}: ArtistContextProviderProps) => {
  const params = useParams();
  
  const channel_id = params.channel_id as string;
  const routeKey = `artist-${channel_id}`;
  
  // Use synchronous sessionStorage check instead of async React state
  const isBackNav = checkBackNavFlag();
  
  // Check for cached state on back navigation
  const cachedState = isBackNav 
    ? getPageState<QueryParamsChannelMusicArtist>(routeKey) 
    : null;
  
  const [filterParams, setFilterParams] = useState<QueryParamsChannelMusicArtist>(
    cachedState?.filterParams ?? initialQueryParams
  );

  // Hook to save/restore page state for back navigation (filterParams only)
  usePageStateCache<QueryParamsChannelMusicArtist>({
    routeKey,
    filterParams,
    setFilterParams,
    cachedScrollPosition: cachedState?.scrollPosition,
  });

  return (
    <ArtistContext.Provider value={{
      filterParams,
      setFilterParams
    }}>
      {children}
    </ArtistContext.Provider>
  );
};

export const useArtistContext = () => {
  const ctx = useContext(ArtistContext);
  if (!ctx) throw new Error("useArtistContext must be used within a ArtistContextProvider");
  return ctx;
};

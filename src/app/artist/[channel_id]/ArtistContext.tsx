"use client";

import { QueryParamsChannelMusicArtist } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";

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
  const [filterParams, setFilterParams] = useState<QueryParamsChannelMusicArtist>(initialQueryParams);

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

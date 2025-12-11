"use client";

import { useParams } from "next/navigation";
import { QueryParamsLiveItem } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface LivestreamContextType {
  filterParams: QueryParamsLiveItem;
  setFilterParams: (params: QueryParamsLiveItem) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const LivestreamContext = createContext<LivestreamContextType | undefined>(undefined);

interface LivestreamContextProviderProps {
  children: ReactNode,
  initialQueryParams: QueryParamsLiveItem,
}

export const LivestreamContextProvider = ({
  children,
  initialQueryParams
}: LivestreamContextProviderProps) => {
  const params = useParams();
  const [filterParams, setFilterParams] = useState<QueryParamsLiveItem>(initialQueryParams);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  if (!params.item_id) {
    return null
  }

  return (
    <LivestreamContext.Provider value={{
      filterParams,
      setFilterParams,
      isLoading, setIsLoading
    }}>
      {children}
    </LivestreamContext.Provider>
  );
};

export const useLivestreamContext = () => {
  const ctx = useContext(LivestreamContext);
  if (!ctx) throw new Error("useLivestreamContext must be used within an LivestreamContextProvider");
  return ctx;
};

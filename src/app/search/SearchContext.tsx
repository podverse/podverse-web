"use client";

import { SearchPodcastsFeed } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { apiRequestService } from "../../factories/apiRequestService";
import { useSkipInitialEffect } from "../../hooks/useSkipInitialEffect";

type SearchParams = {
  q: string;
}

interface SearchContextType {
  searchParams: SearchParams;
  setSearchParams: (params: SearchParams) => void;
  searchResultFeeds: SearchPodcastsFeed[];
  setSearchResultFeeds: (feeds: SearchPodcastsFeed[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchContextProviderProps {
  children: ReactNode,
}

export const SearchContextProvider = ({
  children
}: SearchContextProviderProps) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({ q: "" });
  const [searchResultFeeds, setSearchResultFeeds] = useState<SearchPodcastsFeed[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useSkipInitialEffect(() => {
    async function fetchSearchResults() {
      const trimmedQ = searchParams.q.trim();
      setIsLoading(true);
      if (trimmedQ) {
        try {
          const response = await apiRequestService.reqSearchPodcasts({
            q: trimmedQ
          });
          setSearchResultFeeds(response.feeds);
        } catch (error) {
          console.error("Error fetching search results:", error);
          setSearchResultFeeds([]);
        }
      } else {
        setSearchResultFeeds([]);
      }
      setIsLoading(false);
    }
    fetchSearchResults();
  }, [searchParams]);

  return (
    <SearchContext.Provider value={{
      searchParams, setSearchParams,
      searchResultFeeds, setSearchResultFeeds,
      isLoading, setIsLoading
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearchContext must be used within a SearchContextProvider");
  return ctx;
};

import React from "react";
import { useSearchContext } from "./SearchContext";
import LoadingSpinnerOverlay from "../../components/LoadingSpinner/LoadingSpinnerOverlay";
import { ListSearchResultsPodcastIndexFeeds } from "../../components/List/SearchResults/ListSearchResultsPodcastIndexFeeds";

export const SearchList: React.FC = () => {
  const { searchResultFeeds, isLoading } = useSearchContext();
  
  return (
    <>
      <ListSearchResultsPodcastIndexFeeds searchResultPodcastIndexFeeds={searchResultFeeds} />
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </>
  );
};

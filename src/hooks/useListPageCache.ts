"use client";

import { useState, useRef } from "react";
import { checkBackNavFlag } from "../contexts/Navigation";
import { usePageStateCache } from "./usePageStateCache";
import { getPageState } from "../utils/pageStateCache";

/**
 * Cached data structure for list pages with pagination
 */
export interface ListPageCachedData<TData> {
  data: TData;
  totalPages: number;
}

interface UseListPageCacheOptions<TParams, TData> {
  routeKey: string;
  initialParams: TParams;
  ssrData: TData;
  ssrTotalPages: number;
}

interface UseListPageCacheResult<TParams, TData> {
  filterParams: TParams;
  setFilterParams: (params: TParams) => void;
  data: TData;
  setData: (data: TData) => void;
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
  shouldSkipFetch: React.MutableRefObject<boolean>;
  isRestoredFromCache: React.MutableRefObject<boolean>;
}

/**
 * Hook that encapsulates all caching logic for list pages with pagination.
 * Handles:
 * - Checking for cached state on back navigation (synchronously via sessionStorage)
 * - Initializing state from cache or SSR
 * - Setting up usePageStateCache for saving state
 * - Providing shouldSkipFetch ref to skip unnecessary fetches
 * - Providing isRestoredFromCache ref for list components to skip scroll-to-top
 * 
 * Usage:
 * ```
 * const {
 *   filterParams, setFilterParams,
 *   data: channels, setData: setChannels,
 *   totalPages, setTotalPages,
 *   shouldSkipFetch,
 *   isRestoredFromCache
 * } = useListPageCache({
 *   routeKey: "podcasts",
 *   initialParams: initialQueryParams,
 *   ssrData: ssrChannels,
 *   ssrTotalPages,
 * });
 * 
 * useSkipInitialEffect(() => {
 *   if (shouldSkipFetch.current) {
 *     shouldSkipFetch.current = false;
 *     return;
 *   }
 *   // ... fetch logic
 * }, [filterParams, loggedInAccount]);
 * ```
 */
export function useListPageCache<TParams, TData>({
  routeKey,
  initialParams,
  ssrData,
  ssrTotalPages,
}: UseListPageCacheOptions<TParams, TData>): UseListPageCacheResult<TParams, TData> {
  // Use synchronous sessionStorage check instead of async React state
  // This ensures we detect back navigation on the first render
  const isBackNav = checkBackNavFlag();
  
  // Check for cached state on back navigation
  const cachedState = isBackNav 
    ? getPageState<TParams, ListPageCachedData<TData>>(routeKey) 
    : null;
  
  // Track if we restored from cache to skip fetch
  const shouldSkipFetch = useRef(!!cachedState?.data);
  
  // Track if this render is from cache restoration (for list components to skip scroll-to-top)
  const isRestoredFromCache = useRef(!!cachedState?.data);
  
  // Initialize state from cache or SSR
  const [filterParams, setFilterParams] = useState<TParams>(
    cachedState?.filterParams ?? initialParams
  );
  const [data, setData] = useState<TData>(
    cachedState?.data?.data ?? ssrData
  );
  const [totalPages, setTotalPages] = useState<number>(
    cachedState?.data?.totalPages ?? ssrTotalPages ?? 1
  );

  // Set up caching for saves and scroll restoration
  usePageStateCache<TParams, ListPageCachedData<TData>>({
    routeKey,
    filterParams,
    setFilterParams,
    data: { data, totalPages },
    setData: (cached) => {
      setData(cached.data);
      setTotalPages(cached.totalPages);
    },
    // Pass the cached scroll position for restoration
    cachedScrollPosition: cachedState?.scrollPosition,
  });

  return {
    filterParams,
    setFilterParams,
    data,
    setData,
    totalPages,
    setTotalPages,
    shouldSkipFetch,
    isRestoredFromCache,
  };
}

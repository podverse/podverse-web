"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { checkBackNavFlag, clearBackNavFlag } from "../contexts/Navigation";
import { savePageState, getPageState, getScrollPosition, restoreScrollPosition } from "../utils/pageStateCache";

interface UsePageStateCacheOptions<TParams, TData = unknown> {
  routeKey: string; // e.g., "podcasts", "episodes", "clips"
  filterParams: TParams;
  setFilterParams: (params: TParams) => void;
  data?: TData;
  setData?: (data: TData) => void;
  onRestoreComplete?: () => void;
  /** If provided, restore this scroll position (used by useListPageCache which already has the cached state) */
  cachedScrollPosition?: number;
}

export function usePageStateCache<TParams, TData = unknown>({
  routeKey,
  filterParams,
  setFilterParams,
  data,
  setData,
  onRestoreComplete,
  cachedScrollPosition,
}: UsePageStateCacheOptions<TParams, TData>) {
  const hasRestoredRef = useRef(false);
  const pathname = usePathname();

  // Memoize onRestoreComplete to avoid dependency issues
  const onRestoreCompleteRef = useRef(onRestoreComplete);
  onRestoreCompleteRef.current = onRestoreComplete;

  // Restore scroll position on back navigation
  // This effect handles scroll restoration after the data has been set
  useEffect(() => {
    // Check synchronously if this is a back navigation
    const isBackNav = checkBackNavFlag();
    
    if (isBackNav && !hasRestoredRef.current) {
      hasRestoredRef.current = true;
      
      // If scroll position was passed in (from useListPageCache), use it
      // Otherwise, try to get it from the cached state
      let scrollPos = cachedScrollPosition;
      if (scrollPos === undefined) {
        const cached = getPageState<TParams, TData>(routeKey);
        scrollPos = cached?.scrollPosition;
        
        // Also restore data if not already done by useListPageCache
        if (cached) {
          setFilterParams(cached.filterParams);
          if (cached.data !== undefined && setData) {
            setData(cached.data);
          }
        }
      }
      
      // Restore scroll after content renders
      if (scrollPos !== undefined) {
        // Use a longer delay to ensure content has rendered
        setTimeout(() => {
          restoreScrollPosition(scrollPos!);
          clearBackNavFlag();
          onRestoreCompleteRef.current?.();
        }, 100);
      } else {
        clearBackNavFlag();
      }
    }
  }, [routeKey, setFilterParams, setData, cachedScrollPosition]);

  // Save state before navigation (on any click)
  useEffect(() => {
    const saveState = () => {
      savePageState<TParams, TData>(routeKey, {
        filterParams,
        data,
        scrollPosition: getScrollPosition(),
      });
    };

    // Save on link clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (link && link.href && !link.href.startsWith("#")) {
        saveState();
      }
    };

    document.addEventListener("click", handleClick, true);
    window.addEventListener("beforeunload", saveState);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("beforeunload", saveState);
    };
  }, [routeKey, filterParams, data]);

  // Reset restoration flag when route changes
  useEffect(() => {
    hasRestoredRef.current = false;
  }, [pathname]);

  return {
    isRestoring: checkBackNavFlag() && !hasRestoredRef.current,
  };
}

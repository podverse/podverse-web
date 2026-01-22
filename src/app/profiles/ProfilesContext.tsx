"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { DTOAccount, getTotalPages, QueryParamsSubscribedType, QueryParamsSubscribedFullSort, QueryParamsStatsRange } from "podverse-helpers";
import { apiRequestService } from "../../factories/apiRequestService";
import { useAccount } from "../../contexts/Account";
import { useSkipInitialEffect } from "../../hooks/useSkipInitialEffect";
import { useFilterDefaults } from "../../hooks/useFilterDefaults";
import { useListPageCache } from "../../hooks/useListPageCache";
import { getProfilesFilterParams } from "./ProfilesDropdownConfig";

export type ProfilesQueryParams = {
  page: number;
  type: QueryParamsSubscribedType;
  sort: QueryParamsSubscribedFullSort;
  range: QueryParamsStatsRange | null;
};

interface ProfilesContextType {
  filterParams: ProfilesQueryParams;
  setFilterParams: (params: ProfilesQueryParams) => void;
  accounts: DTOAccount[];
  setAccounts: (accounts: DTOAccount[]) => void;
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  showSubscribeMessage: boolean;
  setShowSubscribeMessage: (show: boolean) => void;
};

const ProfilesContext = createContext<ProfilesContextType | undefined>(undefined);

interface ProfilesContextProviderProps {
  children: ReactNode,
  initialQueryParams: ProfilesQueryParams,
  ssrAccounts: DTOAccount[],
  ssrTotalPages: number
}

export const ProfilesContextProvider = ({
  children,
  initialQueryParams,
  ssrAccounts,
  ssrTotalPages
}: ProfilesContextProviderProps) => {
  // Use the list page cache hook for back navigation caching
  const {
    filterParams, setFilterParams,
    data: accounts, setData: setAccounts,
    totalPages, setTotalPages,
    shouldSkipFetch
  } = useListPageCache<ProfilesQueryParams, DTOAccount[]>({
    routeKey: "profiles",
    initialParams: initialQueryParams,
    ssrData: ssrAccounts ?? [],
    ssrTotalPages,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSubscribeMessage, setShowSubscribeMessage] = useState<boolean>(false);
  const { loggedInAccount } = useAccount();

  useFilterDefaults('profiles', filterParams);

  useSkipInitialEffect(() => {
    // Skip fetch if we just restored from cache - data is already correct
    if (shouldSkipFetch.current) {
      shouldSkipFetch.current = false;
      return;
    }

    async function fetchAccounts() {
      if (filterParams.type === "subscribed") {
        if (!loggedInAccount) {
          setAccounts([]);
          setShowSubscribeMessage(true);
          return;
        }
      }

      setIsLoading(true);

      const { currentSort, currentRange, currentType } = getProfilesFilterParams({
        page: filterParams.page,
        type: filterParams.type,
        sort: filterParams.sort,
        range: filterParams.range
      }, !!loggedInAccount);

      const response = await apiRequestService.reqAccountGetMany({
        type: currentType,
        sort: currentSort,
        range: currentRange,
        page: filterParams.page
      });

      const totalPages = getTotalPages(response.meta.count || response.data.length, response.meta.limit || 50, response.data.length, filterParams.page);
      setTotalPages(totalPages);
      setAccounts(response.data);
      setShowSubscribeMessage(false);
      setIsLoading(false);
    }
    fetchAccounts();
  }, [filterParams, loggedInAccount]);

  return (
    <ProfilesContext.Provider value={{
      filterParams, setFilterParams,
      accounts, setAccounts,
      totalPages, setTotalPages,
      isLoading, setIsLoading,
      showSubscribeMessage, setShowSubscribeMessage
    }}>
      {children}
    </ProfilesContext.Provider>
  );
};

export const useProfilesContext = () => {
  const ctx = useContext(ProfilesContext);
  if (!ctx) throw new Error("useProfilesContext must be used within a ProfilesContextProvider");
  return ctx;
};

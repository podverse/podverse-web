"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DTOClip, getTotalPages, QueryParamsGetManyPartial, removeQueryParamByPattern } from "podverse-helpers";
import { apiRequestService } from "../../factories/apiRequestService";
import { useAccount } from "../../contexts/Account";
import { useSkipInitialEffect } from "../../hooks/useSkipInitialEffect";
import { ROUTES } from "../../constants/routes";
import { getEpisodesFilterParams } from "../episodes/EpisodesDropdownConfig";

interface ClipsContextType {
  filterParams: QueryParamsGetManyPartial;
  setFilterParams: (params: QueryParamsGetManyPartial) => void;
  clips: DTOClip[];
  setClips: (clips: DTOClip[]) => void;
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  showSubscribeMessage: boolean;
  setShowSubscribeMessage: (show: boolean) => void;
  showCategoriesModal: boolean;
  setShowCategoriesModal: (show: boolean) => void;
};

const ClipsContext = createContext<ClipsContextType | undefined>(undefined);

interface ClipsContextProviderProps {
  children: ReactNode,
  initialQueryParams: QueryParamsGetManyPartial,
  ssrClips: DTOClip[],
  ssrTotalPages: number
}

export const ClipsContextProvider = ({
  children,
  initialQueryParams,
  ssrClips,
  ssrTotalPages
}: ClipsContextProviderProps) => {
  const router = useRouter();
  const [filterParams, setFilterParams] = useState<QueryParamsGetManyPartial>(initialQueryParams);
  const [clips, setClips] = useState<DTOClip[]>(ssrClips || []);
  const [totalPages, setTotalPages] = useState<number>(ssrTotalPages || 1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSubscribeMessage, setShowSubscribeMessage] = useState<boolean>(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState<boolean>(false);
  const { loggedInAccount } = useAccount();

  useSkipInitialEffect(() => {
    async function fetchItems() {
      if (filterParams.type === "subscribed") {
        if (!loggedInAccount) {
          setClips([]);
          setShowSubscribeMessage(true);
          return;
        }
      }

      setIsLoading(true);
      
      const { currentSort, currentRange, currentType } = getEpisodesFilterParams({
        page: filterParams.page,
        type: filterParams.type,
        sort: filterParams.sort,
        range: filterParams.range,
        category: filterParams.category
      }, !!loggedInAccount);

      const response = await apiRequestService.reqClipGetManyPublic({
        page: filterParams.page,
        medium: "podcasts",
        type: currentType,
        sort: currentSort,
        range: currentRange,
        category: filterParams.category
      });

      if (!filterParams.category) {
        router.replace(removeQueryParamByPattern(ROUTES.CLIPS, "category"));
      }

      const totalPages = getTotalPages(response.meta.count, response.meta.limit, response.data.length, filterParams.page);
      setTotalPages(totalPages);
      setClips(response.data);
      setShowSubscribeMessage(false);
      setIsLoading(false);
    }
    fetchItems();
  }, [filterParams, loggedInAccount]);

  return (
    <ClipsContext.Provider value={{
      filterParams, setFilterParams,
      clips, setClips,
      totalPages, setTotalPages,
      isLoading, setIsLoading,
      showSubscribeMessage, setShowSubscribeMessage,
      showCategoriesModal, setShowCategoriesModal
    }}>
      {children}
    </ClipsContext.Provider>
  );
};

export const useClipsContext = () => {
  const ctx = useContext(ClipsContext);
  if (!ctx) throw new Error("useClipsContext must be used within a ClipsContextProvider");
  return ctx;
};

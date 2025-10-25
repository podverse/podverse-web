
"use client";

import { DTOQueue, QueryParamsHistory } from "podverse-helpers";
import React from "react";
import { MainWrapper } from "../../components/Main/MainWrapper";
import { HistoryPageContextProvider } from "./HistoryPageContext";
import { HistoryHeader } from "./HistoryHeader";
import { HistoryList } from "./HistoryList";
import { HistoryListHeader } from "./HistoryListHeader";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";
import { SideContent } from "../../components/SideContent/SideContent";

interface HistoryClientProps {
  initialQueryParams: QueryParamsHistory;
  ssrQueues: DTOQueue[];
}

export function HistoryClient(props: HistoryClientProps) {
  const { initialQueryParams, ssrQueues } = props;

  return (
    <HistoryPageContextProvider
      initialQueryParams={initialQueryParams}
      ssrQueues={ssrQueues}
    >
      <HistoryHeader />
      <MainWrapper>
        <MainInnerWrapper>
          <SideContent />
          <MainInnerContentWrapper>
            <HistoryListHeader />
            <HistoryList />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </HistoryPageContextProvider>
  );
}

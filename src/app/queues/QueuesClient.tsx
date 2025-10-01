
"use client";

import { DTOQueue, QueryParamsQueues } from "podverse-helpers";
import React from "react";
import { MainWrapper } from "../../components/Main/MainWrapper";
import { QueuesPageContextProvider } from "./QueuesPageContext";
import { QueuesHeader } from "./QueuesHeader";
import { QueuesList } from "./QueuesList";
import { QueuesListHeader } from "./QueuesListHeader";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";
import { SideContent } from "../../components/SideContent/SideContent";

interface QueuesClientProps {
  initialQueryParams: QueryParamsQueues;
  ssrQueues: DTOQueue[];
}

export function QueuesClient(props: QueuesClientProps) {
  const { initialQueryParams, ssrQueues } = props;

  return (
    <QueuesPageContextProvider
      initialQueryParams={initialQueryParams}
      ssrQueues={ssrQueues}
    >
      <QueuesHeader />
      <MainWrapper>
        <MainInnerWrapper>
          <SideContent />
          <MainInnerContentWrapper>
            <QueuesListHeader />
            <QueuesList />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </QueuesPageContextProvider>
  );
}

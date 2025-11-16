
"use client";

import React from "react";
import { SearchContextProvider } from "./SearchContext";
import { SearchHeader } from "./SearchHeader";
import { MainWrapper } from "../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";
import { SearchListHeader } from "./SearchListHeader";
import { SideContent } from "../../components/SideContent/SideContent";
import { SearchList } from "./SearchList";

export function SearchClient() {
  return (
    <SearchContextProvider>
      <MainWrapper>
        <SearchHeader />
        <MainInnerWrapper>
          <SideContent />
          <MainInnerContentWrapper>
            <SearchListHeader />
            <SearchList />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </SearchContextProvider>
  );
}

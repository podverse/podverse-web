import React from "react";
import { DTOChannel, QueryParamsHome } from "podverse-helpers";
import { MainWrapper } from "../components/Main/MainWrapper";
import { MainInnerWrapper } from "../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../components/Main/MainInnerContentWrapper";
import { HomeContextProvider } from "./HomeContext";
import { HomeList } from "./HomeList";
import { HomeHeader } from "./HomeHeader";

type HomeClientProps = {
  initialQueryParams: QueryParamsHome;
  ssrChannels: DTOChannel[];
  isValidAuthSession: boolean;
  ssrTotalPages: number;
};

export function HomeClient({ initialQueryParams, ssrChannels, ssrTotalPages }: HomeClientProps) {

  return (
    <HomeContextProvider
      initialQueryParams={initialQueryParams}
      ssrChannels={ssrChannels}
      ssrTotalPages={ssrTotalPages}
    >
      <HomeHeader />
      <MainWrapper>
        <MainInnerWrapper>
          <MainInnerContentWrapper>
            <HomeList />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </HomeContextProvider>
  );
}

"use client";

import { DTOAccount } from "podverse-helpers";
import React from "react";
import { ProfilesContextProvider, ProfilesQueryParams } from "./ProfilesContext";
import { MainWrapper } from "../../components/Main/MainWrapper";
import { ProfilesHeader } from "./ProfilesHeader";
import { ProfilesList } from "./ProfilesList";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";
import { SideContent } from "../../components/SideContent/SideContent";

interface ProfilesClientProps {
  initialQueryParams: ProfilesQueryParams;
  ssrAccounts: DTOAccount[];
  ssrTotalPages: number;
}

export function ProfilesClient(props: ProfilesClientProps) {
  const { initialQueryParams, ssrAccounts, ssrTotalPages } = props;
  
  return (
    <ProfilesContextProvider
      initialQueryParams={initialQueryParams}
      ssrAccounts={ssrAccounts}
      ssrTotalPages={ssrTotalPages}
    >
      <ProfilesHeader />
      <MainWrapper>
        <MainInnerWrapper>
          <SideContent />
          <MainInnerContentWrapper>
            <ProfilesList />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </ProfilesContextProvider>
  );
}

"use client";

import { DTOAccount } from "podverse-helpers";
import React from "react";
import { MainWrapper } from "../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";
import { ProfileHeader } from "../../components/Media/Profile/ProfileHeader";
import { MyProfileContentContextProvider } from "./MyProfileContentContext";
import { MyProfileContentList } from "./MyProfileContentList";
import { MyProfileContentListHeader } from "./MyProfileContentListHeader";

interface MyProfileClientProps {
  ssrAccount: DTOAccount;
}

export function MyProfileClient(props: MyProfileClientProps) {
  const { ssrAccount } = props;

  return (
    <MyProfileContentContextProvider account={ssrAccount}>
      <MainWrapper>
        <ProfileHeader account={ssrAccount} isOwnProfile={true} />
        <MainInnerWrapper>
          <MainInnerContentWrapper>
            <MyProfileContentListHeader />
            <MyProfileContentList />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </MyProfileContentContextProvider>
  );
}

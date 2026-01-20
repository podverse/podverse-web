"use client";

import { DTOAccount } from "podverse-helpers";
import React from "react";
import { MainWrapper } from "../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";
import { ProfileHeader } from "../../components/Media/Profile/ProfileHeader";

interface MyProfileClientProps {
  ssrAccount: DTOAccount;
}

export function MyProfileClient(props: MyProfileClientProps) {
  const { ssrAccount } = props;

  return (
    <MainWrapper>
      <ProfileHeader account={ssrAccount} isOwnProfile={true} />
      <MainInnerWrapper>
        <MainInnerContentWrapper>
          <div>My Profile Client</div>
        </MainInnerContentWrapper>
      </MainInnerWrapper>
    </MainWrapper>
  );
}

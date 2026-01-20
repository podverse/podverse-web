"use client";

import { DTOAccount } from "podverse-helpers";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainWrapper } from "../../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../../components/Main/MainInnerContentWrapper";
import { ProfileHeader } from "../../../components/Media/Profile/ProfileHeader";
import { useAccount } from "../../../contexts/Account";
import { ProfileContentContextProvider } from "./ProfileContentContext";
import { ProfileContentList } from "./ProfileContentList";
import { ProfileContentListHeader } from "./ProfileContentListHeader";

interface ProfileClientProps {
  ssrAccount: DTOAccount;
}

export function ProfileClient(props: ProfileClientProps) {
  const { ssrAccount } = props;
  const { loggedInAccount } = useAccount();
  const router = useRouter();
  
  const isOwnProfile = loggedInAccount?.id === ssrAccount.id;

  useEffect(() => {
    // Redirect to my-profile if user is viewing their own profile
    if (loggedInAccount && loggedInAccount.id === ssrAccount.id) {
      router.replace("/my-profile");
    }
  }, [loggedInAccount, ssrAccount.id, router]);

  // Don't render if redirecting
  if (loggedInAccount && loggedInAccount.id === ssrAccount.id) {
    return null;
  }

  return (
    <ProfileContentContextProvider account={ssrAccount}>
      <MainWrapper>
        <ProfileHeader account={ssrAccount} isOwnProfile={isOwnProfile} />
        <MainInnerWrapper>
          <MainInnerContentWrapper>
            <ProfileContentListHeader />
            <ProfileContentList />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </ProfileContentContextProvider>
  );
}

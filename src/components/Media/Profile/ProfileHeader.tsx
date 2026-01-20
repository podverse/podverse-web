"use client";

import { DTOAccount } from "podverse-helpers";
import React from "react";
import { ProfileHeaderViewDesktop } from "./ProfileHeaderViewDesktop";
import { ProfileHeaderViewTablet } from "./ProfileHeaderViewTablet";
import styles from "../../../styles/components/Media/Profile/ProfileHeader.module.scss";

type ProfileHeaderProps = {
  account: DTOAccount;
  isOwnProfile?: boolean;
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ account, isOwnProfile = false }) => {
  return (
    <header className={styles.header}>
      <ProfileHeaderViewDesktop account={account} isOwnProfile={isOwnProfile} />
      <ProfileHeaderViewTablet account={account} isOwnProfile={isOwnProfile} />
    </header>
  );
};

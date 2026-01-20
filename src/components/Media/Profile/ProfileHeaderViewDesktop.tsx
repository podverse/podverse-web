"use client";

import { DTOAccount } from "podverse-helpers";
import React from "react";
import { useTranslations } from "next-intl";
import { ProfileHeaderButtons } from "./ProfileHeaderButtons";
import styles from "../../../styles/components/Media/Profile/ProfileHeaderViewDesktop.module.scss";

type ProfileHeaderViewDesktopProps = {
  account: DTOAccount;
  isOwnProfile: boolean;
};

export const ProfileHeaderViewDesktop: React.FC<ProfileHeaderViewDesktopProps> = ({ account, isOwnProfile }) => {
  const tMisc = useTranslations("misc");
  
  const displayName = account.account_profile?.display_name?.trim() || tMisc("anonymous");
  const bio = account.account_profile?.bio?.trim() || null;

  return (
    <div className={styles.contentDesktop}>
      <div className={styles.textSection}>
        <h1 className={styles.title}>{displayName}</h1>
        {bio && (
          <p className={styles.bio}>{bio}</p>
        )}
        <div className={styles.bottomSection}>
          <ProfileHeaderButtons account={account} isOwnProfile={isOwnProfile} />
        </div>
      </div>
    </div>
  )
};

"use client";

import { DTOAccount } from "podverse-helpers";
import React from "react";
import { useTranslations } from "next-intl";
import { ProfileHeaderButtons } from "./ProfileHeaderButtons";
import styles from "../../../styles/components/Media/Profile/ProfileHeaderViewTablet.module.scss";

type ProfileHeaderViewTabletProps = {
  account: DTOAccount;
  isOwnProfile: boolean;
};

export const ProfileHeaderViewTablet: React.FC<ProfileHeaderViewTabletProps> = ({ account, isOwnProfile }) => {
  const tMisc = useTranslations("misc");
  
  const displayName = account.account_profile?.display_name?.trim() || tMisc("anonymous");
  const bio = account.account_profile?.bio?.trim() || null;

  return (
    <div className={styles.contentTablet}>
      <div className={styles.topSection}>
        <h1 className={styles.title}>{displayName}</h1>
      </div>
      <div className={styles.bottomSection}>
        <div className={styles.textSection}>
          {bio && (
            <p className={styles.bio}>{bio}</p>
          )}
          <ProfileHeaderButtons account={account} isOwnProfile={isOwnProfile} />
        </div>
      </div>
    </div>
  )
};

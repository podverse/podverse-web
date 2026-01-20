"use client";

import { DTOAccount } from "podverse-helpers";
import React from "react";
import { useRouter } from "next/navigation";
import { SubscribeButton } from "../Header/SubscribeButton";
import { ROUTES } from "../../../constants/routes";
import styles from "../../../styles/components/Media/Header/HeaderButtons.module.scss";

type ProfileHeaderButtonsProps = {
  account: DTOAccount;
  isOwnProfile: boolean;
};

export const ProfileHeaderButtons: React.FC<ProfileHeaderButtonsProps> = ({ account, isOwnProfile }) => {
  const router = useRouter();

  const handleEditClick = () => {
    router.push(`${ROUTES.SETTINGS}?tab=profile`);
  };

  return (
    <div className={styles.buttons}>
      <SubscribeButton 
        entity={account} 
        kind="profile" 
        onEdit={isOwnProfile ? handleEditClick : undefined}
      />
    </div>
  )
};

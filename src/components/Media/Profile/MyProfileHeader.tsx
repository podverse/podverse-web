"use client";

import { DTOAccount } from "podverse-helpers";
import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "../../Button/Button";
import { ROUTES } from "../../../constants/routes";
import { ProfileHeader } from "./ProfileHeader";
import styles from "../../../styles/components/Media/Profile/MyProfileHeader.module.scss";

type MyProfileHeaderProps = {
  account: DTOAccount;
};

export const MyProfileHeader: React.FC<MyProfileHeaderProps> = ({ account }) => {
  const tMisc = useTranslations("misc");
  const router = useRouter();

  const handleEditClick = () => {
    router.push(`${ROUTES.SETTINGS}?tab=profile`);
  };

  return (
    <div className={styles.wrapper}>
      <ProfileHeader account={account} />
      <div className={styles.editButtonContainer}>
        <Button
          variant="miniGlowWarning"
          className={styles.editButton}
          onClick={handleEditClick}
        >
          {tMisc("edit")}
        </Button>
      </div>
    </div>
  );
};

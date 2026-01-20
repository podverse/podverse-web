"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { DTOAccount } from "podverse-helpers";
import React from "react";
import { ROUTES } from "../../../constants/routes";
import styles from "../../../styles/components/List/Profiles/ListProfileRow.module.scss";

interface Props {
  account: DTOAccount;
}

export const ListProfileRow: React.FC<Props> = ({ account }) => {
  const url = `${ROUTES.PROFILE}/${account.id_text}`;
  const tMisc = useTranslations("misc");
  
  const displayName = account.account_profile?.display_name?.trim() || tMisc("anonymous");
  const bio = account.account_profile?.bio?.trim() || null;
  
  return (
    <Link href={url} className={styles.link}>
      <div className={styles.listItem}>
        <div className={styles.content}>
          <h3 className={styles.title}>{displayName}</h3>
          {bio && (
            <p className={styles.bio}>{bio}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

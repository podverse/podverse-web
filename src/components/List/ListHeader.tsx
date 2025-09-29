"use client";

import React from "react";
import styles from "../../styles/components/List/ListHeader.module.scss";

type ListHeaderProps = {
  tabs?: React.ReactNode;
  sideButtons?: React.ReactNode;
  belowButtons?: React.ReactNode;
};

export const ListHeader: React.FC<ListHeaderProps> = ({ tabs, sideButtons, belowButtons }) => (
  <header className={styles.listHeader}>
    <div className={styles.listHeaderTop}>
      {tabs}
      {
        sideButtons && (
          <div className={styles.sideButtons}>
            {sideButtons}
          </div>
        )
      }
    </div>
    {
      belowButtons && (
        <div className={styles.listHeaderBottom}>
          {belowButtons}
        </div>
      )
    }
  </header>
);

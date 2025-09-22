"use client";

import React from "react";
import styles from "../../styles/components/List/ListHeader.module.scss";

type ListHeaderProps = {
  tabs?: React.ReactNode;
  filterDropdowns?: React.ReactNode[];
  buttonTabs?: React.ReactNode;
};

export const ListHeader: React.FC<ListHeaderProps> = ({ tabs, filterDropdowns, buttonTabs }) => (
  <header className={styles.listHeader}>
    <div className={styles.listHeaderTop}>
      {tabs}
      <div className={styles.filterDropdowns}>
        {filterDropdowns}
      </div>
    </div>
    {
      buttonTabs && (
        <div className={styles.listHeaderBottom}>
          {buttonTabs}
        </div>
      )
    }
  </header>
);

export default ListHeader;

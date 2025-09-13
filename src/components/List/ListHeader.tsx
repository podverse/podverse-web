"use client";

import React from "react";
import styles from "../../styles/components/List/ListHeader.module.scss";

type ListHeaderProps = {
  title: string;
  filterDropdowns?: React.ReactNode[];
};

export const ListHeader: React.FC<ListHeaderProps> = ({ title, filterDropdowns }) => (
  <header className={styles.listHeader}>
    <div className={styles.listHeaderContent}>
      <div className={styles.filterDropdowns}>
        {filterDropdowns}
      </div>
    </div>
  </header>
);

export default ListHeader;

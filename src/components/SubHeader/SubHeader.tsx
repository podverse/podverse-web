"use client";

import React from "react";
import styles from "../../styles/components/SubHeader/SubHeader.module.scss";

type SubHeaderProps = {
  title: string;
  filterDropdowns?: React.ReactNode[];
};

export const SubHeader: React.FC<SubHeaderProps> = ({ title, filterDropdowns }) => (
  <header className={styles.subheader}>
    <div className={styles.subheaderContent}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.filterDropdowns}>
        {filterDropdowns}
      </div>
    </div>
  </header>
);

export default SubHeader;

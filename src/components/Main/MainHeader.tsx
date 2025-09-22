"use client";

import React from "react";
import styles from "../../styles/components/Main/MainHeader.module.scss";

type MainHeaderProps = {
  title: string;
  buttonsNode?: React.ReactNode;
};

const MainHeader: React.FC<MainHeaderProps> = ({ title, buttonsNode }) => (
  <header className={styles.header}>
    <div className={styles.headerContent}>
      <h1 className={styles.title}>{title}</h1>
      {
        buttonsNode && (
          <div className={styles.buttons}>
            {buttonsNode}
          </div>
        )
      }
    </div>
  </header>
);

export default MainHeader;

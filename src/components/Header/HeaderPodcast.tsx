"use client";

import React from "react";
import styles from "../../styles/components/Main/MainHeader.module.scss";

type HeaderPodcastProps = {
  title: string;
};

const HeaderPodcast: React.FC<HeaderPodcastProps> = ({ title }) => (
  <header className={styles.header}>
    <div className={styles.headerContent}>
      <h1 className={styles.title}>{title}</h1>
    </div>
  </header>
);

export default HeaderPodcast;

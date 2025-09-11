"use client";

import React from "react";
import styles from "../../styles/components/Header/HeaderPodcast.module.scss";
import { DTOChannel } from "podverse-helpers";

type HeaderPodcastProps = {
  channel: DTOChannel;
};

const HeaderPodcast: React.FC<HeaderPodcastProps> = ({ channel }) => (
  <header className={styles.header}>
    <div className={styles.headerContent}>
      <h1 className={styles.title}>{channel.title}</h1>
    </div>
  </header>
);

export default HeaderPodcast;

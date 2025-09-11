import { DTOChannel } from "podverse-helpers";
import React from "react";
import styles from "../../styles/components/Header/HeaderPodcast.module.scss";
import Image from "../Image/Image";
import { IMAGE_HEADER_SQUARE_SIZE } from "../../constants/images";

type HeaderPodcastProps = {
  channel: DTOChannel;
};

const HeaderPodcast: React.FC<HeaderPodcastProps> = ({ channel }) => (
  <header className={styles.header}>
    <div className={styles.headerContent}>
      <div className={styles.headerImageWrapper}>
        <Image
          src={channel.channel_images?.[0]?.url}
          alt={channel.title || "Podcast Image"}
          width={IMAGE_HEADER_SQUARE_SIZE}
          height={IMAGE_HEADER_SQUARE_SIZE}
          className={styles.image}
        />
      </div>
      <h1 className={styles.title}>{channel.title}</h1>
    </div>
  </header>
);

export default HeaderPodcast;

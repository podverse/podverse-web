import { DTOChannel, findDTOChannelImageBySize } from "podverse-helpers";
import React from "react";
import styles from "../../styles/components/Header/HeaderPodcast.module.scss";
import Image from "../Image/Image";
import { IMAGES } from "../../constants/images";
import HeaderSubtitle from "./HeaderPodcastSubtitle";
import { useTranslations } from "next-intl";

type HeaderPodcastProps = {
  channel: DTOChannel;
};

const HeaderPodcast: React.FC<HeaderPodcastProps> = ({ channel }) => {
  const channel_image = findDTOChannelImageBySize(channel.channel_images, IMAGES.HEADER.SQUARE.SIZE_FIND_TARGET, 'greater');
  const tMedia = useTranslations("media");

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Image
          src={channel_image?.url}
          alt={channel.title || tMedia("podcast.podcast_image")}
          width={IMAGES.HEADER.SQUARE.SIZE}
          height={IMAGES.HEADER.SQUARE.SIZE}
          className={styles.image}
        />
        <div className={styles.textSection}>
          <h1 className={styles.title}>{channel.title}</h1>
          <HeaderSubtitle channel={channel} categoryPath="podcasts" />
        </div>
        <div className={styles.buttonSection}>
          Unsubscribe
        </div>
      </div>
    </header>
  )
};

export default HeaderPodcast;

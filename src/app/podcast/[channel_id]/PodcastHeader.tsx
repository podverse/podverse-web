import { DTOChannel } from "podverse-helpers";
import React from "react";
import PodcastHeaderButtons from "./PodcastHeaderButtons";
import { PodcastHeaderImage } from "./PodcastHeaderImage";
import PodcastHeaderSubtitle from "./PodcastHeaderSubtitle";
import styles from "../../../styles/app/podcast/PodcastHeader.module.scss";
import { Button } from "../../../components/Button/Button";

type PodcastHeaderProps = {
  channel: DTOChannel;
  shareOnClick: () => void;
};

const PodcastHeader: React.FC<PodcastHeaderProps> = ({ channel, shareOnClick }) => {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <PodcastHeaderImage channel={channel} />
        <div className={styles.textSection}>
          <h1 className={styles.title}>{channel.title}</h1>
          <PodcastHeaderSubtitle channel={channel} />
          <PodcastHeaderButtons
            channel={channel}
            shareOnClick={shareOnClick} />
        </div>
        <Button
          className={styles.buttonSection}
          variant="miniGlow">
          Unsubscribe
        </Button>
      </div>
    </header>
  )
};

export default PodcastHeader;

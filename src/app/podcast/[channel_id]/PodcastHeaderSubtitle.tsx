import { DTOChannel } from "podverse-helpers";
import React from "react";
import styles from "../../../styles/app/podcast/PodcastHeaderSubtitle.module.scss";
import { PodcastHeaderCategories } from "./PodcastHeaderCategories";

type PodcastHeaderSubtitleProps = {
  channel: DTOChannel;
};

const PodcastHeaderSubtitle: React.FC<PodcastHeaderSubtitleProps> = ({ channel }) => {
  const channel_about = channel.channel_about;
  const author = channel_about?.author;
  const channel_categories = channel.channel_categories;
  const hasChannelCategories = channel_categories && channel_categories.length > 0;
  
  return (
    <div className={styles.subtitle}>
      <span>{author}</span>
      {author && hasChannelCategories && ' • '}
      <PodcastHeaderCategories channel_categories={channel_categories} />
    </div>
  )
};

export default PodcastHeaderSubtitle;

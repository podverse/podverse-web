"use client";

import { useTranslations } from "next-intl";
import { DTOChannel } from "podverse-helpers";
import React from "react";
import { FaGlobe, FaRss, FaShare } from "react-icons/fa";
import Link from "../../../components/Link/Link";
import styles from "../../../styles/app/podcast/PodcastHeaderButtons.module.scss";
import { usePodcastContext } from "./PodcastContext";

type PodcastHeaderButtonsProps = {
  channel: DTOChannel;
  shareOnClick: () => void;
};

const PodcastHeaderButtons: React.FC<PodcastHeaderButtonsProps> = ({ channel }) => {
  const tInfo = useTranslations("info");
  const { setPodcastModalShareIsOpen } = usePodcastContext();

  return (
    <div className={styles.buttons}>
      {
        channel?.feed?.url && (
          <Link
            className={styles.button}
            href={channel.feed.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={tInfo("rss_feed")}
            title={tInfo("rss_feed")}
            color="secondary">
            <FaRss />
          </Link>
        )
      }
      {
        channel?.channel_about?.website_link_url && (
          <Link
            className={styles.button}
            href={channel.channel_about.website_link_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={tInfo("website")}
            title={tInfo("website")}
            color="secondary">
            <FaGlobe />
          </Link>
        )
      }
      <Link
        type="button"
        onClick={() => setPodcastModalShareIsOpen(true)}
        className={styles.button}
        aria-label={tInfo("share")}
        title={tInfo("share")}
        color="secondary">
        <FaShare />
      </Link>
    </div>
  )
};

export default PodcastHeaderButtons;

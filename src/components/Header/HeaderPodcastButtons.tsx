"use client";

import { DTOChannel } from "podverse-helpers";
import React from "react";
import { FaGlobe, FaRss } from "react-icons/fa";
import styles from "../../styles/components/Header/HeaderPodcastButtons.module.scss";
import Link from "../Link/Link";
import { useTranslations } from "next-intl";

type HeaderPodcastButtonsProps = {
  channel: DTOChannel;
};

const HeaderPodcastButtons: React.FC<HeaderPodcastButtonsProps> = ({ channel }) => {
  const tInfo = useTranslations("info");

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
    </div>
  )
};

export default HeaderPodcastButtons;

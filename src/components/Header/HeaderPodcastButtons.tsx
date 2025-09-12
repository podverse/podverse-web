"use client";

import { DTOChannel } from "podverse-helpers";
import React from "react";
import { FaRss } from "react-icons/fa";
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
    </div>
  )
};

export default HeaderPodcastButtons;

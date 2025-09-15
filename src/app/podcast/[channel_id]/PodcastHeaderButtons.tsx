"use client";

import { useTranslations } from "next-intl";
import { DTOChannel } from "podverse-helpers";
import React from "react";
import { FaCommentDollar, FaGlobe, FaRss, FaShare } from "react-icons/fa";
import Link from "../../../components/Link/Link";
import styles from "../../../styles/app/podcast/PodcastHeaderButtons.module.scss";
import { usePodcastContext } from "./PodcastContext";
import { FaCircleDollarToSlot } from "react-icons/fa6";

type PodcastHeaderButtonsProps = {
  channel: DTOChannel;
};

const PodcastHeaderButtons: React.FC<PodcastHeaderButtonsProps> = ({ channel }) => {
  const tInfo = useTranslations("info");
  const tValue = useTranslations("value");

  const {
    setPodcastModalShareIsOpen,
    setPodcastModalFundingIsOpen,
    setPodcastModalBoostIsOpen
  } = usePodcastContext();

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
      {
        channel?.channel_fundings?.length > 0 && (
          <Link
            type="button"
            onClick={() => setPodcastModalFundingIsOpen(true)}
            className={styles.button}
            aria-label={tInfo("funding")}
            title={tInfo("funding")}
            color="secondary">
            <FaCircleDollarToSlot />
          </Link>
        )
      }
      {
        channel?.channel_values?.length > 0 && (
          <Link
            type="button"
            onClick={() => setPodcastModalBoostIsOpen(true)}
            className={styles.buttonGold}
            aria-label={tValue("boost")}
            title={tValue("boost")}
            color="secondary">
            <FaCommentDollar />
          </Link>
        )
      }
    </div>
  )
};

export default PodcastHeaderButtons;

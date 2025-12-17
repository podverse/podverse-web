"use client";

import { useTranslations } from "next-intl";
import { DTOChannel, DTOItem } from "podverse-helpers";
import React from "react";
import { FaCircleDollarToSlot, FaCommentDollar, FaGlobe, FaRss, FaShare } from "react-icons/fa6";
import { Link } from "../../../../components/Link/Link";
import { useModals } from "../../../../contexts/Modals";
import { AlbumHeaderSubscribeButton } from "./AlbumHeaderSubscribeButton";
// import { AlbumHeaderNotificationButton } from "./AlbumHeaderNotificationButton";
import styles from "../../../../styles/components/Media/Podcast/PodcastHeaderButtons.module.scss";

type AlbumHeaderButtonsProps = {
  channel: DTOChannel;
  item?: DTOItem;
};

export const AlbumHeaderButtons: React.FC<AlbumHeaderButtonsProps> = ({ channel, item = null }) => {
  const tFeatures = useTranslations("features");
  const tInfo = useTranslations("info");
  const tValue = useTranslations("value");

  const {
    setModalShare,
    setModalFunding,
    setModalBoost
  } = useModals();

  return (
    <div className={styles.buttons}>
      {
        channel && (
          <AlbumHeaderSubscribeButton channel={channel} />
        )
      }
      {/* <AlbumHeaderNotificationButton channel={channel} /> */}
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
        onClick={() => setModalShare({ channel, item, clip: null, item_chapter: null, item_soundbite: null })}
        className={styles.button}
        aria-label={tFeatures("share")}
        title={tFeatures("share")}
        color="secondary">
        <FaShare />
      </Link>
      {
        (channel?.channel_fundings?.length ?? 0) > 0 && (
          <Link
            type="button"
            onClick={() => setModalFunding({ channel_fundings: channel.channel_fundings || [], item_fundings: [] })}
            className={styles.button}
            aria-label={tInfo("funding")}
            title={tInfo("funding")}
            color="secondary">
            <FaCircleDollarToSlot />
          </Link>
        )
      }
      {
        (channel?.channel_values?.length ?? 0) > 0 && (
          <Link
            type="button"
            onClick={() => setModalBoost({ channel, item })}
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

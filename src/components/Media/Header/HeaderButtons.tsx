"use client";

import { useTranslations } from "next-intl";
import { DTOChannel, DTOClip, DTOItem, DTOItemChapter, DTOItemSoundbite } from "podverse-helpers";
import React from "react";
import { FaCircleDollarToSlot, FaCommentDollar, FaGlobe, FaRss, FaShare } from "react-icons/fa6";
import { IconButton } from "./IconButton";
import { useModals } from "../../../contexts/Modals";
import { NotificationIconButton } from "./NotificationIconButton";
import { SubscribeButton } from "./SubscribeButton";
import styles from "../../../styles/components/Media/Header/HeaderButtons.module.scss";

type ShareArgs = {
  item?: DTOItem | null;
  clip?: DTOClip | null;
  item_chapter?: DTOItemChapter | null;
  item_soundbite?: DTOItemSoundbite | null;
}

type HeaderButtonsProps = {
  channel: DTOChannel;
  shareArgs?: ShareArgs;
  kind: "podcast" | "artist" | "album" | "playlist";
}

export const HeaderButtons: React.FC<HeaderButtonsProps> = ({ channel, shareArgs = {}, kind }) => {
  const tFeatures = useTranslations("features");
  const tInfo = useTranslations("info");
  const tValue = useTranslations("value");

  const {
    setModalShare,
    setModalFunding,
    setModalBoost
  } = useModals();

  const {
    item = null,
    clip = null,
    item_chapter = null,
    item_soundbite = null
  } = shareArgs;

  return (
    <div className={styles.buttons}>
      <SubscribeButton entity={channel} kind={kind} />
      <NotificationIconButton channel={channel} kind={kind} />
      {channel?.feed?.url && (
        <IconButton
          href={channel.feed.url}
          target="_blank"
          rel="noopener noreferrer"
          ariaLabel={tInfo("rss_feed")}
          title={tInfo("rss_feed")}
          color="secondary"
        >
          <FaRss />
        </IconButton>
      )}
      {channel?.channel_about?.website_link_url && (
        <IconButton
          href={channel.channel_about.website_link_url}
          target="_blank"
          rel="noopener noreferrer"
          ariaLabel={tInfo("website")}
          title={tInfo("website")}
          color="secondary"
        >
          <FaGlobe />
        </IconButton>
      )}
      <IconButton
        type="button"
        onClick={() => setModalShare({ channel, item, clip, item_chapter, item_soundbite })}
        ariaLabel={tFeatures("share")}
        title={tFeatures("share")}
        color="secondary"
      >
        <FaShare />
      </IconButton>
      {(channel?.channel_fundings?.length ?? 0) > 0 && (
        <IconButton
          type="button"
          onClick={() => setModalFunding({ channel_fundings: channel.channel_fundings || [], item_fundings: [] })}
          ariaLabel={tInfo("funding")}
          title={tInfo("funding")}
          color="secondary"
        >
          <FaCircleDollarToSlot />
        </IconButton>
      )}
      {(channel?.channel_values?.length ?? 0) > 0 && (
        <IconButton
          type="button"
          onClick={() => setModalBoost({ channel, item })}
          ariaLabel={tValue("boost")}
          title={tValue("boost")}
          color="secondary"
          isGold
        >
          <FaCommentDollar />
        </IconButton>
      )}
    </div>
  )
}

export default HeaderButtons;

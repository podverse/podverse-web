"use client";

import { DTOPlaylist, formatDateAbbrev, MediumEnum } from "podverse-helpers";
import styles from "../../../styles/app/playlist/PlaylistHeaderInfo.module.scss";
import { useTranslations } from "next-intl";

type PlaylistHeaderInfoProps = {
  playlist: DTOPlaylist;
};

export const PlaylistHeaderInfo = ({ playlist }: PlaylistHeaderInfoProps) => {
  const tMedia = useTranslations("media");
  const tFeatures = useTranslations("features");
  const tMisc = useTranslations("misc");

  const lastUpdated = tMedia("last_updated", { date: formatDateAbbrev(playlist.last_updated) });
  const itemCount = tFeatures("playlist.item_count", { count: playlist.item_count });
  const displayName = playlist.account?.account_profile?.display_name || tMisc("anonymous");
  const info = `${itemCount} • ${lastUpdated}`;
  
  let medium = "";
  if (playlist.medium_id === MediumEnum.Podcast) {
    medium = tMedia("podcast.podcasts");
  } else if (playlist.medium_id === MediumEnum.Video) {
    medium = tMedia("video.videos");
  } else if (playlist.medium_id === MediumEnum.Music) {
    medium = tMedia("music.music");
  } else if (playlist.medium_id === MediumEnum.Mixed) {
    medium = tMedia("mixed");
  }

  const description = `${medium} ${playlist.description ? `• ${playlist.description}` : ""}`;

  return (
    <>
      <div className={styles.creator}>
        {displayName}
      </div>
      <div className={styles.info}>
        {info}
      </div>
      <div className={styles.description}>{description}</div>
    </>
  );
}

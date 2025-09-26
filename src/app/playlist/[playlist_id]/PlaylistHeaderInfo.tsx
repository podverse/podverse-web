"use client";

import { DTOPlaylist, formatDateAbbrev } from "podverse-helpers";
import styles from "../../../styles/app/playlist/PlaylistHeaderInfo.module.scss";
import { useLocale, useTranslations } from "next-intl";
import { MEDIUM } from "../../../constants/medium";

type PlaylistHeaderInfoProps = {
  playlist: DTOPlaylist;
};

export const PlaylistHeaderInfo = ({ playlist }: PlaylistHeaderInfoProps) => {
  const tMedia = useTranslations("media");
  const tFeatures = useTranslations("features");
  const tMisc = useTranslations("misc");
  const locale = useLocale();

  const lastUpdated = tMedia("last_updated", { date: formatDateAbbrev(playlist.last_updated, locale) });
  const itemCount = tFeatures("playlist.item_count", { count: playlist.item_count });
  const displayName = playlist.account?.account_profile?.display_name || tMisc("anonymous");
  const info = `${itemCount} • ${lastUpdated}`;
  const medium = MEDIUM.getMediumTranslation(playlist.medium_id, tMedia);
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

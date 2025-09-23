"use client";

import { DTOPlaylist, formatDateAbbrev } from "podverse-helpers";
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
  const description = playlist.description;

  return (
    <>
      <div className={styles.creator}>
        {displayName}
      </div>
      <div className={styles.info}>
        {info}
      </div>
      {
        description && (
          <div className={styles.description}>{description}</div>
        )
      }
    </>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { DTOPlaylist } from "podverse-helpers";
import React from "react";
import Link from "../../Link/Link";
import { ROUTES } from "../../../constants/routes";
import styles from "../../../styles/components/List/Playlists/ListPlaylistRow.module.scss";

interface Props {
  playlist: DTOPlaylist;
  showCreator?: boolean
  onClick?: () => void;
}

export const ListPlaylistRow: React.FC<Props> = ({ playlist, showCreator, onClick }) => {
  const tMisc = useTranslations("misc");
  const tFeatures = useTranslations("features");
  const url = `${ROUTES.PLAYLIST}/${playlist.id_text}`;
  const creator = playlist?.account?.account_profile?.display_name || tMisc("anonymous");

  return (
    <Link
      href={!onClick ? url : undefined}
      className={styles.link}
      onClick={onClick}
    >
      <div className={styles.listItem}>
        <div className={styles.content}>
          <h3>{playlist.title}</h3>
          <div className={styles.subtitleWrapper}>
            <span>{tFeatures("playlist.item_count", { count: playlist.item_count })}</span>
            {
              playlist.description && (
                <>
                  <span> – </span>
                  <span>{playlist.description}</span>
                </>
              )
            }
          </div>
          {
            showCreator && (
              <div className={styles.creator}>{creator}</div>
            )
          }
        </div>
      </div>
    </Link>
  );
};

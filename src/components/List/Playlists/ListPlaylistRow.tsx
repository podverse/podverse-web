"use client";

import Link from "next/link";
import { DTOPlaylist } from "podverse-helpers";
import React from "react";
import { ROUTES } from "../../../constants/routes";
import styles from "../../../styles/components/List/Playlists/ListPlaylistRow.module.scss";
import { useTranslations } from "next-intl";

interface Props {
  playlist: DTOPlaylist;
  showCreator?: boolean
}

export const ListPlaylistRow: React.FC<Props> = ({ playlist, showCreator }) => {
  const tMisc = useTranslations("misc");
  const tFeatures = useTranslations("features");
  const url = `${ROUTES.PLAYLIST}/${playlist.id_text}`;
  const creator = playlist?.account?.account_profile?.display_name || tMisc("anonymous");

  return (
    <Link href={url} className={styles.link}>
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

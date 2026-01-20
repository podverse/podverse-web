"use client";

import { DTOPlaylist } from "podverse-helpers";
import React from "react";
import { useRouter } from "next/navigation";
import { PlaylistHeaderInfo } from "./PlaylistHeaderInfo";
import { SubscribeButton } from "../../../components/Media/Header/SubscribeButton";
import styles from "../../../styles/app/playlist/PlaylistHeader.module.scss";

type PlaylistHeaderProps = {
  playlist: DTOPlaylist;
};

export const PlaylistHeader: React.FC<PlaylistHeaderProps> = ({ playlist }) => {
  const router = useRouter();

  const handleEditClick = () => {
    router.push(`/playlist/edit/${playlist.id_text}`);
  };

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.textSection}>
          <h1 className={styles.title}>{playlist.title}</h1>
          <PlaylistHeaderInfo playlist={playlist} />
        </div>
        <SubscribeButton entity={playlist} kind="playlist" onEdit={handleEditClick} />
      </div>
    </header>
  )
};

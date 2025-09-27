"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { FaPlus } from "react-icons/fa6";
import { MainHeader } from "../../components/Main/MainHeader";
import { Button } from "../../components/Button/Button";
import styles from "../../styles/app/playlists/PlaylistsHeader.module.scss";
import { useRouter } from "next/navigation";

export const PlaylistsHeader: React.FC = () => {
  const tFeatures = useTranslations("features");
  const router = useRouter();

  const buttonsNode = (
    <>
      <Button
        variant="mini"
        onClick={() => router.push("/playlist/create")}
      >
        {tFeatures("playlist.create_playlist")}
        <FaPlus className={styles.icon} />
      </Button>
    </>
  );

  return (
    <MainHeader
      title={tFeatures("playlist.playlists")}
      buttonsNode={buttonsNode}
    />
  );
};

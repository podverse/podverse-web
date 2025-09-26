"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { Modal } from "../../Modal/Modal";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { MediaPlayerInfoModal } from "./MediaPlayerInfoModal";
import styles from "../../../styles/components/MediaPlayer/Modal/MediaPlayerModal.module.scss";

export const MediaPlayerModal: React.FC = () => {
  const tMediaPlayer = useTranslations("media_player");
  const { playerModalIsOpen, setPlayerModalIsOpen } = useMediaPlayer();

  return (
    <Modal
      isOpen={playerModalIsOpen}
      onClose={() => setPlayerModalIsOpen(false)}
      ariaLabel={tMediaPlayer("fullscreen_media_player")}
      contentTransparent
    >
      <div className={styles.mediaPlayerModal}>
        <MediaPlayerInfoModal />
      </div>
    </Modal>
  );
};
"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { Modal } from "./Modal";
import { useModals } from "../../contexts/Modals";

export const ModalPlaylistAddTo: React.FC = () => {
  const tFeatures = useTranslations("features");
  const header = tFeatures("playlist.add_to_playlist");
  const { modalPlaylistAddTo, setModalPlaylistAddTo } = useModals();

  if (!modalPlaylistAddTo.item) return null;

  const clearModalPlaylistAddTo = () => {
    setModalPlaylistAddTo({
      channel: null,
      item: null,
      clip: null,
      chapter: null,
      soundbite: null
    });
  }

  return (
    <Modal
      isOpen={!!modalPlaylistAddTo.item}
      onClose={clearModalPlaylistAddTo}
      header={header}
      ariaLabel={header}
      modalContentMaxWidth={500}>
      <div>playlists</div>
    </Modal>
  );
};
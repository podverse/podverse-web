"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { Modal } from "./Modal";
import { useModals } from "../../contexts/Modals";
import { MediaHeaderMini } from "../MediaHeaderMini/MediaHeaderMini";

export const ModalClip: React.FC = () => {
  const tFeatures = useTranslations("features");
  const header = tFeatures("clip.create_clip");
  const { modalClip, setModalClip } = useModals();

  if (!modalClip.channel || !modalClip.item) {
    return null;
  }

  const clearModalClip = () => {
    setModalClip({
      channel: null,
      item: null
    });
  }

  // const onClick = async (playlist: DTOPlaylist) => {
  //   alert("Hello");
  // }

  return (
    <Modal
      isOpen={!!modalClip.item}
      onClose={clearModalClip}
      header={header}
      ariaLabel={header}
      modalContentMaxWidth={500}>
      <MediaHeaderMini
        channel={modalClip.channel}
        item={modalClip.item}
      />
    </Modal>
  );
};
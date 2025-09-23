"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { Modal } from "./Modal";
import { useModals } from "../../contexts/Modals";
import { MediaHeaderMini } from "../MediaHeaderMini/MediaHeaderMini";
import { MediumEnum } from "podverse-helpers/dist/lib/medium";
import { ButtonTabs } from "../Tabs/ButtonTabs";

export const ModalPlaylistAddTo: React.FC = () => {
  const tFeatures = useTranslations("features");
  const tFilters = useTranslations("filters");
  const tMedia = useTranslations("media");
  const header = tFeatures("playlist.add_to_playlist");
  const { modalPlaylistAddTo, setModalPlaylistAddTo } = useModals();
  const [mediumId, setMediumId] = React.useState<number | null>(null);

  if (!modalPlaylistAddTo.channel || !modalPlaylistAddTo.item) {
    return null;
  }

  const clearModalPlaylistAddTo = () => {
    setModalPlaylistAddTo({
      channel: null,
      item: null,
      clip: null,
      chapter: null,
      soundbite: null
    });
  }

  const buttonTabs = [
    {
      key: MediumEnum.Podcast,
      label: tMedia("podcast.podcasts"),
      onClick: () => setMediumId(MediumEnum.Podcast)
    },
    {
      key: MediumEnum.Video,
      label: tMedia("video.videos"),
      onClick: () => setMediumId(MediumEnum.Video)
    },
    {
      key: MediumEnum.Music,
      label: tMedia("music.music"),
      onClick: () => setMediumId(MediumEnum.Music)
    },
    {
      key: MediumEnum.Mixed,
      label: tMedia("mixed"),
      onClick: () => setMediumId(MediumEnum.Mixed)
    }
  ]

  let selectedMediumId = mediumId;
  if (!mediumId) {
    selectedMediumId =
      modalPlaylistAddTo?.channel?.medium_id || MediumEnum.Podcast;
  }

  return (
    <Modal
      isOpen={!!modalPlaylistAddTo.item}
      onClose={clearModalPlaylistAddTo}
      header={header}
      ariaLabel={header}
      modalContentMaxWidth={500}>
      <MediaHeaderMini
        channel={modalPlaylistAddTo.channel}
        item={modalPlaylistAddTo.item}
        chapter={modalPlaylistAddTo.chapter}
        soundbite={modalPlaylistAddTo.soundbite}
      />
      <ButtonTabs
        buttonTabs={buttonTabs}
        selectedKey={selectedMediumId ?? MediumEnum.Podcast}
      />
    </Modal>
  );
};
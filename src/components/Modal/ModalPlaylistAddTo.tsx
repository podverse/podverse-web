"use client";

import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { Modal } from "./Modal";
import { useModals } from "../../contexts/Modals";
import { MediaHeaderMini } from "../MediaHeaderMini/MediaHeaderMini";
import { MediumEnum } from "podverse-helpers/dist/lib/medium";
import { ButtonTabs } from "../Tabs/ButtonTabs";
import { apiRequestService } from "../../factories/apiRequestService";
import { DTOPlaylist, getTotalPages } from "podverse-helpers";
import { ListPlaylists } from "../List/Playlists/ListPlaylists";
import { useAccount } from "../../contexts/Account";

export const ModalPlaylistAddTo: React.FC = () => {
  const tFeatures = useTranslations("features");
  const tMedia = useTranslations("media");
  const header = tFeatures("playlist.add_to_playlist");
  const { modalPlaylistAddTo, setModalPlaylistAddTo } = useModals();
  const [mediumId, setMediumId] = React.useState<number | null>(null);
  const [playlists, setPlaylists] = React.useState<DTOPlaylist[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const { loggedInAccount } = useAccount();

  const fetchPlaylists = async (page: number, mediumId: number | null) => {
    const response = await apiRequestService.reqPlaylistGetManyPrivate({
      page,
      sort: "a_z",
      medium_id: mediumId || MediumEnum.Podcast
    });
    return {
      playlists: response.data,
      totalPages: getTotalPages(response.meta?.count, response.meta?.limit)
    };
  };

  useEffect(() => {
    (async () => {
      const { playlists, totalPages } = await fetchPlaylists(1, mediumId);
      setPlaylists(playlists);
      setTotalPages(totalPages);
    })();
  }, [mediumId]);

  useEffect(() => {
    (async () => {
      const { playlists, totalPages } = await fetchPlaylists(page, mediumId);
      setPlaylists(playlists);
      setTotalPages(totalPages);
    })();
  }, [page]);

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
      <ListPlaylists
        page={page}
        setPage={setPage}
        playlists={playlists}
        totalPages={totalPages}
        showLoginMessage={!!loggedInAccount}
      />
    </Modal>
  );
};
"use client";

import { useTranslations } from "next-intl";
import { MediumEnum } from "podverse-helpers";
import React from "react";
import { Modal } from "./Modal";
import { MEDIUM } from "../../constants/medium";
import { useModals } from "../../contexts/Modals";
import { MediaHeaderMini } from "../MediaHeaderMini/MediaHeaderMini";
import { ButtonTabs } from "../Tabs/ButtonTabs";
import { apiRequestService } from "../../factories/apiRequestService";
import { DTOPlaylist, getTotalPages } from "podverse-helpers";
import { ListPlaylists } from "../List/Playlists/ListPlaylists";
import { useAccount } from "../../contexts/Account";
import { useSkipInitialEffect } from "../../hooks/useSkipInitialEffect";

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

  useSkipInitialEffect(() => {
    setMediumId(modalPlaylistAddTo.channel?.medium_id ?? MediumEnum.Podcast);
  }, [modalPlaylistAddTo.channel]);

  useSkipInitialEffect(() => {
    const handleFetch = async () => {
      const { playlists, totalPages } = await fetchPlaylists(1, mediumId);
      setPlaylists(playlists);
      setTotalPages(totalPages);
    }

    if (loggedInAccount && modalPlaylistAddTo.channel && mediumId) {
      handleFetch();
    }
  }, [mediumId]);

  useSkipInitialEffect(() => {
    const handleFetch = async () => {
      const { playlists, totalPages } = await fetchPlaylists(page, mediumId);
      setPlaylists(playlists);
      setTotalPages(totalPages);
    }

    if (loggedInAccount && modalPlaylistAddTo.channel && mediumId) {
      handleFetch();
    }
  }, [page]);

  if (!modalPlaylistAddTo.channel || !modalPlaylistAddTo.item) {
    return null;
  }

  const clearModalPlaylistAddTo = () => {
    setModalPlaylistAddTo({
      channel: null,
      item: null,
      clip: null,
      item_chapter: null,
      item_soundbite: null
    });
  }

  const buttonTabs = MEDIUM.buttonTabs(
    modalPlaylistAddTo?.channel?.medium_id ?? MediumEnum.Podcast,
    tMedia,
    setMediumId
  );

  const onClick = async (playlist: DTOPlaylist) => {
    const { item, clip, item_chapter, item_soundbite } = modalPlaylistAddTo;
    if (clip) {
      alert("Add clip to playlist");
    } else if (item_chapter) {
      alert("Add item_chapter to playlist");
    } else if (item_soundbite) {
      alert("Add item_soundbite to playlist");
    } else if (item) {
      await apiRequestService
        .reqPlaylistResourceItemAddFirst(playlist.id_text, item.id_text)
    }

    clearModalPlaylistAddTo();
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
        item_chapter={modalPlaylistAddTo.item_chapter}
        item_soundbite={modalPlaylistAddTo.item_soundbite}
      />
      {
        mediumId && (
          <ButtonTabs
            buttonTabs={buttonTabs}
            selectedKey={mediumId}
          />
        )
      }
      <ListPlaylists
        page={page}
        setPage={setPage}
        playlists={playlists}
        totalPages={totalPages}
        showLoginMessage={!loggedInAccount}
        onClick={onClick}
      />
    </Modal>
  );
};
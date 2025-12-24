"use client";

import { useTranslations } from "next-intl";
import { getQueryParamFromQueueMediumId, getQueueMediumIdForChannelMediumId, MediumEnum,
  QueryParamsQueueMedium } from "podverse-helpers";
import React from "react";
import { Modal } from "./Modal";
import { MEDIUM } from "../../constants/medium";
import { ModalPlaylistAddToState, useModals } from "../../contexts/Modals";
import { MediaHeaderMini } from "../MediaHeaderMini/MediaHeaderMini";
import { ButtonTabs } from "../Tabs/ButtonTabs";
import { apiRequestService } from "../../factories/apiRequestService";
import { DTOPlaylist, getTotalPages } from "podverse-helpers";
import { ListPlaylists } from "../List/Playlists/ListPlaylists";
import { useAccount } from "../../contexts/Account";
import { useSkipInitialEffect } from "../../hooks/useSkipInitialEffect";
import { showToastPromise } from "../Toast/Toast";
import { CallToActionMessage } from "../CallToActionMessage/CallToActionMessage";

type FilterParams = {
  medium: QueryParamsQueueMedium | null;
  page: number;
}

const getCurrentMediumId = (
  filterParams: FilterParams,
  modalPlaylistAddTo: ModalPlaylistAddToState
) => {
  return filterParams.medium
    || getQueryParamFromQueueMediumId(modalPlaylistAddTo?.channel?.medium_id || null)
    || getQueryParamFromQueueMediumId(MediumEnum.AV);
}

export const ModalPlaylistAddTo: React.FC = () => {
  const tFeatures = useTranslations("features");
  const tMedia = useTranslations("media");
  const tInstructions = useTranslations("instructions");
  const tAuthentication = useTranslations("authentication");
  const header = tFeatures("playlist.add_to_playlist");
  const { modalPlaylistAddTo, setModalPlaylistAddTo, setModalAuthLogin } = useModals();
  const [playlists, setPlaylists] = React.useState<DTOPlaylist[]>([]);
  const [totalPages, setTotalPages] = React.useState(0);
  const { loggedInAccount } = useAccount();
  
  const [filterParams, setFilterParams] = React.useState<FilterParams>({
    medium: null,
    page: 1
  });

  const fetchPlaylists = async (page: number, medium: QueryParamsQueueMedium) => {
    const response = await apiRequestService.reqPlaylistGetMany({
      page,
      type: "private",
      sort: "a_z",
      medium,
      range: null
    });
    return {
      playlists: response.data,
      totalPages: getTotalPages(response.meta?.count, response.meta?.limit, response.data.length, page)
    };
  };

  useSkipInitialEffect(() => {
    const handleFetch = async () => {
      const { playlists, totalPages } = await fetchPlaylists(1, getCurrentMediumId(filterParams, modalPlaylistAddTo));
      setPlaylists(playlists);
      setTotalPages(totalPages);
    }

    if (loggedInAccount && modalPlaylistAddTo.channel) {
      handleFetch();
    }
  }, [modalPlaylistAddTo.channel]);

  useSkipInitialEffect(() => {
    const handleFetch = async () => {
      const { playlists, totalPages } = await fetchPlaylists(filterParams.page, getCurrentMediumId(filterParams, modalPlaylistAddTo));
      setPlaylists(playlists);
      setTotalPages(totalPages);
    }

    if (loggedInAccount && modalPlaylistAddTo.channel) {
      handleFetch();
    }
  }, [filterParams]);

  const clearModalPlaylistAddTo = () => {
    setModalPlaylistAddTo({
      channel: null,
      item: null,
      clip: null,
      item_soundbite: null
    });
    setFilterParams({ medium: null, page: 1 });
  }

  const buttonTabs = MEDIUM.buttonTabs(
    getQueueMediumIdForChannelMediumId(modalPlaylistAddTo?.channel?.medium_id) ?? MediumEnum.AV,
    tMedia,
    (mediumId: number) => setFilterParams({ medium: getQueryParamFromQueueMediumId(mediumId), page: 1 })
  );

  const onClick = async (playlist: DTOPlaylist) => {
    const { item, clip, item_soundbite } = modalPlaylistAddTo;
    if (clip) {
      showToastPromise(
        apiRequestService.reqPlaylistResourceClipAddFirst(playlist.id_text, clip.id_text),
        {
          success: tFeatures("playlist.added_to_playlist"),
          error: tFeatures("playlist.add_error")
        }
      );
    } else if (item_soundbite) {
      showToastPromise(
        apiRequestService.reqPlaylistResourceItemSoundbiteAddFirst(playlist.id_text, item_soundbite.id_text),
        {
          success: tFeatures("playlist.added_to_playlist"),
          error: tFeatures("playlist.add_error")
        }
      );
    } else if (item) {
      showToastPromise(
        apiRequestService.reqPlaylistResourceItemAddFirst(playlist.id_text, item.id_text),
        {
          success: tFeatures("playlist.added_to_playlist"),
          error: tFeatures("playlist.add_error")
        }
      );
    }

    clearModalPlaylistAddTo();
  }

  if (!modalPlaylistAddTo.channel) {
    return null
  };

  return (
    <Modal
      isOpen={!!modalPlaylistAddTo.item}
      onClose={clearModalPlaylistAddTo}
      header={header}
      ariaLabel={header}
      modalContentMaxWidth={500}>
      {
        !loggedInAccount && (
          <CallToActionMessage
            message={tInstructions("login_to_create_playlists")}
            buttonLabel={tAuthentication("login")}
            onButtonClick={() => {
              setModalPlaylistAddTo({ channel: null, item: null, clip: null, item_soundbite: null });
              setModalAuthLogin({ isOpen: true })
            }}
          />
        )
      }
      {
        loggedInAccount && (
          <>
            <MediaHeaderMini
              channel={modalPlaylistAddTo.channel}
              item={modalPlaylistAddTo.item}
              item_soundbite={modalPlaylistAddTo.item_soundbite}
            />
            <ButtonTabs
              buttonTabs={buttonTabs}
              selectedKey={getCurrentMediumId(filterParams, modalPlaylistAddTo)}
            />
            <ListPlaylists
              page={filterParams.page}
              setPage={(page: number) => setFilterParams({ ...filterParams, page })}
              playlists={playlists}
              totalPages={totalPages}
              showLoginMessage={false}
              onClick={onClick}
            />
          </>
        )
      }
    </Modal>
  );
};
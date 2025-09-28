"use client";

import { useTranslations } from "next-intl";
import { DTOPlaylist, QueryParamsPlaylistsType } from "podverse-helpers";
import React from "react";
import { CallToActionMessage } from "../../CallToActionMessage/CallToActionMessage";
import Pagination from "../../Pagination/Pagination";
import { useModals } from "../../../contexts/Modals";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { scrollMainToTop } from "../../../utils/scroll";
import { ListPlaylistRow } from "./ListPlaylistRow";
import styles from "../../../styles/components/List/Playlists/ListPlaylists.module.scss";

type Props = {
  page: number;
  setPage: (page: number) => void;
  playlists: DTOPlaylist[];
  totalPages: number;
  showLoginMessage: boolean;
  type?: QueryParamsPlaylistsType;
  showCreator?: boolean;
  onClick?: (playlist: DTOPlaylist) => void;
};

export const ListPlaylists: React.FC<Props> = ({ page = 1, setPage, playlists, totalPages, showLoginMessage, showCreator, onClick }) => {
  const tInstructions = useTranslations("instructions");
  const tAuthentication = useTranslations("authentication");
  const { setModalLogin } = useModals();

  useSkipInitialEffect(() => {
    scrollMainToTop();
  }, [playlists]);

  const showCallToAction = showLoginMessage;
  const showPagination = !showLoginMessage;

  return (
    <>
      {showCallToAction && (
        <CallToActionMessage
          message={tInstructions("login_for_playlists")}
          buttonLabel={tAuthentication("login")}
          onButtonClick={() => setModalLogin({ isOpen: true })}
        />
      )}
      {
        showPagination && (
          <div className={styles.listWrapper}>
            <Pagination
              currentPage={page}
              maxButtons={5}
              totalPages={totalPages}
              setPage={setPage}
              paginationControlsClassName={styles.paginationControls}>
              {playlists.map((playlist) => (
                <ListPlaylistRow
                  key={playlist.id_text}
                  playlist={playlist}
                  showCreator={showCreator}
                  onClick={onClick ? () => onClick(playlist) : undefined}
                />
              ))}
            </Pagination>
          </div>
        )
      }
    </>
  );
};

"use client";

import { useTranslations } from "next-intl";
import { DTOChannel, QueryParamsSubscribedMusicType } from "podverse-helpers";
import React, { useRef } from "react";
import { ListAlbumNodes } from "./ListAlbumNodes";
import { CallToActionMessage } from "../../../CallToActionMessage/CallToActionMessage";
import Pagination from "../../../Pagination/Pagination";
import { useModals } from "../../../../contexts/Modals";
import { checkBackNavFlag } from "../../../../contexts/Navigation";
import { useSkipInitialEffect } from "../../../../hooks/useSkipInitialEffect";
import { scrollMainToTop } from "../../../../utils/scroll";
import { ViewSelectedOption } from "../../../ViewSelector/ViewSelector";
import styles from "../../../../styles/components/List/Podcasts/ListPodcasts.module.scss";

type Props = {
  page: number;
  setPage: (page: number) => void;
  channels: DTOChannel[];
  totalPages: number;
  showSubscribeMessage: boolean;
  type: QueryParamsSubscribedMusicType;
  viewSelected: ViewSelectedOption;
};

export const ListAlbums: React.FC<Props> = ({ page, setPage,
  channels, totalPages, showSubscribeMessage, viewSelected }) => {
  const tInstructions = useTranslations("instructions");
  const tAuthentication = useTranslations("authentication");
  const { setModalAuthLogin } = useModals();
  
  // Track if we should skip scroll on the first effect run (back navigation case)
  const skipScrollOnceRef = useRef(checkBackNavFlag());

  useSkipInitialEffect(() => {
    // Skip scroll-to-top once if this is a back navigation
    if (skipScrollOnceRef.current) {
      skipScrollOnceRef.current = false;
      return;
    }
    scrollMainToTop();
  }, [channels]);
  
  const showCallToAction = showSubscribeMessage;
  const showPagination = !showSubscribeMessage;

  const listNodes = ListAlbumNodes({ channels, viewSelected });

  return (
    <>
      {showCallToAction && (
        <CallToActionMessage
          message={tInstructions("login_for_subscriptions")}
          buttonLabel={tAuthentication("login")}
          onButtonClick={() => setModalAuthLogin({ isOpen: true })}
        />
      )}
      {
        showPagination && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            setPage={setPage}
            paginationControlsClassName={styles.paginationControls}>
            {listNodes}
          </Pagination>
        )
      }
    </>
  );
};

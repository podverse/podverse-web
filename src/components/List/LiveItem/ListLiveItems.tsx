"use client";

import { useTranslations } from "next-intl";
import { DTOItem } from "podverse-helpers";
import React from "react";
import { CallToActionMessage } from "../../CallToActionMessage/CallToActionMessage";
import Pagination from "../../Pagination/Pagination";
import { useModals } from "../../../contexts/Modals";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { scrollMainToTop } from "../../../utils/scroll";
import { ViewSelectedOption } from "../../ViewSelector/ViewSelector";
import { ListLiveItemNodes } from "./ListLiveItemNodes";
import { InfoWrapper } from "../../InfoWrapper/InfoWrapper";
import styles from "../../../styles/components/List/Podcasts/Episodes/ListEpisodes.module.scss";

type Props = {
  page: number;
  setPage: (page: number) => void;
  items: DTOItem[];
  totalPages: number;
  showSubscribeMessage?: boolean;
  viewSelected: ViewSelectedOption;
  showChannelInfo?: boolean;
};

export const ListLiveItems: React.FC<Props> = ({
  page,
  setPage,
  items,
  totalPages,
  showSubscribeMessage,
  viewSelected,
  showChannelInfo
}) => {
  const tInstructions = useTranslations("instructions");
  const tAuthentication = useTranslations("authentication");
  const tMedia = useTranslations("media");
  const { setModalAuthLogin } = useModals();

  useSkipInitialEffect(() => {
    scrollMainToTop();
  }, [items]);

  const showCallToAction = showSubscribeMessage;
  const showPagination = !showSubscribeMessage;

  const listNodes = ListLiveItemNodes({ items, viewSelected, showChannelInfo });

  const showNoContentFound = page <= 1 && items.length === 0; 

  if (showNoContentFound) {
    return (
      <InfoWrapper>
        <p>
          {tMedia("livestream.no_livestreams_found")}
        </p>
      </InfoWrapper>
    )
  }

  return (
    <>
      {showCallToAction && (
        <CallToActionMessage
          message={tInstructions("login_for_subscriptions")}
          buttonLabel={tAuthentication("login")}
          onButtonClick={() => setModalAuthLogin({ isOpen: true })}
        />
      )}
      {showPagination && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          setPage={setPage}
          paginationControlsClassName={styles.paginationControls}
        >
          {listNodes}
        </Pagination>
      )}
    </>
  );
};

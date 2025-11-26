"use client";

import { useTranslations } from "next-intl";
import { CategoryMappingKeys, DTOChannel, QueryParamsSubscribedType } from "podverse-helpers";
import React from "react";
import { ListPodcastNodes } from "./ListPodcastNodes";
import { CallToActionMessage } from "../../CallToActionMessage/CallToActionMessage";
import Pagination from "../../Pagination/Pagination";
import { useModals } from "../../../contexts/Modals";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { scrollMainToTop } from "../../../utils/scroll";
import { ViewSelectedOption } from "../../ViewSelector/ViewSelector";
import styles from "../../../styles/components/List/Podcasts/ListPodcasts.module.scss";

type Props = {
  page: number;
  setPage: (page: number) => void;
  channels: DTOChannel[];
  totalPages: number;
  showSubscribeMessage: boolean;
  type: QueryParamsSubscribedType;
  category: CategoryMappingKeys | null;
  viewSelected: ViewSelectedOption;
};

export const ListPodcasts: React.FC<Props> = ({ page, setPage,
  channels, totalPages, showSubscribeMessage, viewSelected }) => {
  const tInstructions = useTranslations("instructions");
  const tAuthentication = useTranslations("authentication");
  const { setModalAuthLogin } = useModals();

  useSkipInitialEffect(() => {
    scrollMainToTop();
  }, [channels]);
  
  const showCallToAction = showSubscribeMessage;
  const showPagination = !showSubscribeMessage;

  const listNodes = ListPodcastNodes({ channels, viewSelected });

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
            maxButtons={5}
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

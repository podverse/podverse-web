"use client";

import { useTranslations } from "next-intl";
import { CategoryMappingKeys, DTOChannel, QueryParamsChannelsType } from "podverse-helpers";
import React from "react";
import ListPodcastRow from "./ListPodcastRow";
import CallToActionMessage from "../../CallToActionMessage/CallToActionMessage";
import Pagination from "../../Pagination/Pagination";
import { useModals } from "../../../contexts/Modals";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { scrollMainToTop } from "../../../utils/scroll";
import styles from "../../../styles/components/List/Podcasts/ListPodcasts.module.scss";

type Props = {
  page: number;
  setPage: (page: number) => void;
  channels: DTOChannel[];
  totalPages: number;
  showSubscribeMessage: boolean;
  type?: QueryParamsChannelsType;
  category?: CategoryMappingKeys | null;
};

export const ListPodcasts: React.FC<Props> = ({ page = 1, setPage, channels, totalPages, showSubscribeMessage }) => {
  const tInstructions = useTranslations("instructions");
  const tAuthentication = useTranslations("authentication");
  const { setModalLogin } = useModals();

  useSkipInitialEffect(() => {
    scrollMainToTop();
  }, [channels]);
  
  const showCallToAction = showSubscribeMessage;
  const showPagination = !showSubscribeMessage;

  return (
    <>
      {showCallToAction && (
        <CallToActionMessage
          message={tInstructions("login_for_subscriptions")}
          buttonLabel={tAuthentication("login")}
          onButtonClick={() => setModalLogin({ isOpen: true })}
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
            {channels.map((channel) => (
              <ListPodcastRow key={channel.id} channel={channel} />
            ))}
          </Pagination>
        )
      }
    </>
  );
};

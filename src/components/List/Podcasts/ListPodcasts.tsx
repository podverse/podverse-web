"use client";

import { useTranslations } from "next-intl";
import { CategoryMappingKeys, DTOChannel, QueryParamsChannelsType } from "podverse-helpers";
import React from "react";
import ListPodcastRow from "./ListPodcastRow";
import ListPodcastGridNode from "./ListPodcastGridNode";
import { CallToActionMessage } from "../../CallToActionMessage/CallToActionMessage";
import Pagination from "../../Pagination/Pagination";
import { useModals } from "../../../contexts/Modals";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { scrollMainToTop } from "../../../utils/scroll";
import { Divider } from "../../Divider/Divider";
import { usePodcastsContext } from "../../../app/podcasts/PodcastsContext";
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
  const { setModalAuthLogin } = useModals();
  const { viewSelected } = usePodcastsContext();

  useSkipInitialEffect(() => {
    scrollMainToTop();
  }, [channels]);
  
  const showCallToAction = showSubscribeMessage;
  const showPagination = !showSubscribeMessage;

  let listNodes: React.ReactNode[] = [];

  if (viewSelected === "rows") {
    listNodes = channels.map((channel, idx) => (
      <React.Fragment key={channel.id}>
        <ListPodcastRow channel={channel} />
        {idx < channels.length - 1 && <Divider />}
      </React.Fragment>
    ));
  } else if (viewSelected === "grid") {
    listNodes = [
      <div key="grid" className={styles.grid}>
        {channels.map(channel => (
          <ListPodcastGridNode key={channel.id} channel={channel} />
        ))}
      </div>
    ];
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

"use client";

import { useTranslations } from "next-intl";
import { CategoryMappingKeys, DTOChannel, DTOItem, QueryParamsItemsType } from "podverse-helpers";
import React from "react";
import ListEpisodeRow from "./ListEpisodeRow";
import { CallToActionMessage } from "../../../CallToActionMessage/CallToActionMessage";
import Pagination from "../../../Pagination/Pagination";
import { useModals } from "../../../../contexts/Modals";
import { useSkipInitialEffect } from "../../../../hooks/useSkipInitialEffect";
import { scrollMainToTop } from "../../../../utils/scroll";
import { ListLiveItemRow } from "../../LiveItem/ListLiveItemRow";

type Props = {
  page: number;
  setPage: (page: number) => void;
  channel: DTOChannel;
  items: DTOItem[];
  totalPages: number;
  showSubscribeMessage?: boolean;
  type?: QueryParamsItemsType;
  category?: CategoryMappingKeys | null;
};

const ListEpisodes: React.FC<Props> = ({ page = 1, setPage, channel, items, totalPages, showSubscribeMessage }) => {
  const tInstructions = useTranslations("instructions");
  const tAuthentication = useTranslations("authentication");
  const { setModalAuthLogin } = useModals();

  useSkipInitialEffect(() => {
    scrollMainToTop();
  }, [items]);
  
  const showCallToAction = showSubscribeMessage;
  const showPagination = !showSubscribeMessage;

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
            setPage={setPage}>
            {items.map((item) => {
              if (item.live_item) {
                return <ListLiveItemRow key={item.id} channel={channel} item={item} live_item={item.live_item} />;
              } else {
                return <ListEpisodeRow key={item.id} channel={channel} item={item} />
              }
            })}
          </Pagination>
        )
      }
    </>
  );
};

export default ListEpisodes;

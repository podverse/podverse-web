"use client";

import { useTranslations } from "next-intl";
import { CategoryMappingKeys, DTOItem, QueryParamsItemsType } from "podverse-helpers";
import React, { useRef } from "react";
import ListEpisodeRow from "./ListEpisodeRow";
import CallToActionMessage from "../../../CallToActionMessage/CallToActionMessage";
import Pagination from "../../../Pagination/Pagination";
import { useModals } from "../../../../contexts/Modals";
import { useSkipInitialEffect } from "../../../../hooks/useSkipInitialEffect";

type Props = {
  page: number;
  setPage: (page: number) => void;
  items: DTOItem[];
  totalPages: number;
  showSubscribeMessage: boolean;
  type?: QueryParamsItemsType;
  category?: CategoryMappingKeys | null;
};

const ListEpisodes: React.FC<Props> = ({ page = 1, setPage, items, totalPages, showSubscribeMessage }) => {
  const topRef = useRef<HTMLDivElement>(null);
  const tInstructions = useTranslations("instructions");
  const tAuthentication = useTranslations("authentication");
  const { openModal } = useModals();

  useSkipInitialEffect(() => {
    topRef?.current?.scrollIntoView();
  }, [items]);
  
  const showCallToAction = showSubscribeMessage;
  const showPagination = !showSubscribeMessage;

  return (
    <>
      <div ref={topRef} />
      {showCallToAction && (
        <CallToActionMessage
          message={tInstructions("login_for_subscriptions")}
          buttonLabel={tAuthentication("login")}
          onButtonClick={() => openModal("LoginModal")}
        />
      )}
      {
        showPagination && (
          <Pagination
            currentPage={page}
            maxButtons={5}
            totalPages={totalPages}
            onPageChange={setPage}>
            {items.map((item) => (
              <ListEpisodeRow key={item.id} item={item} />
            ))}
          </Pagination>
        )
      }
    </>
  );
};

export default ListEpisodes;

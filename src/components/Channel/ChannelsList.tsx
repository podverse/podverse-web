"use client";

import { useTranslations } from "next-intl";
import { DTOChannel } from "podverse-helpers";
import React, { useRef } from "react";
import ChannelListItem from "./ChannelsListItem";
import CallToActionMessage from "../CallToActionMessage/CallToActionMessage";
import Pagination from "../Pagination/Pagination";
import { useModals } from "../../contexts/Modals";
import { useSkipInitialEffect } from "../../hooks/useSkipInitialEffect";

type Props = {
  page: number;
  setPage: (page: number) => void;
  channels: DTOChannel[];
  totalPages: number;
  showSubscribeMessage: boolean;
};

const ChannelList: React.FC<Props> = ({ page = 1, setPage, channels, totalPages, showSubscribeMessage }) => {
  const topRef = useRef<HTMLDivElement>(null);
  const tInstructions = useTranslations("instructions");
  const tAuthentication = useTranslations("authentication");
  const { openModal } = useModals();

  useSkipInitialEffect(() => {
    topRef?.current?.scrollIntoView();
  }, [channels]);

  return (
    <>
      <div ref={topRef} />
      {showSubscribeMessage && (
        <CallToActionMessage
          message={tInstructions("login_for_subscriptions")}
          buttonLabel={tAuthentication("login")}
          onButtonClick={() => openModal("LoginModal")}
        />
      )}
      {
        !showSubscribeMessage && (
          <Pagination
            currentPage={page}
            maxButtons={5}
            totalPages={totalPages}
            onPageChange={setPage}>
            {channels.map((channel) => (
              <ChannelListItem key={channel.id} channel={channel} />
            ))}
          </Pagination>
        )
      }
    </>
  );
};

export default ChannelList;
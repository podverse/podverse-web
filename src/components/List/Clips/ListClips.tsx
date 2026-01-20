"use client";

import { useTranslations } from "next-intl";
import { CategoryMappingKeys, DTOChannel, DTOClip, DTOItem, QueryParamsItemsType } from "podverse-helpers";
import React from "react";
import { ListClipRow } from "./ListClipRow";
import { CallToActionMessage } from "../../CallToActionMessage/CallToActionMessage";
import Pagination from "../../Pagination/Pagination";
import { useModals } from "../../../contexts/Modals";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { scrollMainToTop } from "../../../utils/scroll";

type Props = {
  page: number;
  setPage: (page: number) => void;
  channel?: DTOChannel;
  item?: DTOItem;
  clips: DTOClip[];
  totalPages: number;
  showSubscribeMessage?: boolean;
  type?: QueryParamsItemsType;
  category?: CategoryMappingKeys | null;
  showItemInfo?: boolean;
};

export const ListClips: React.FC<Props> = ({ page, setPage,
  channel, item, clips, totalPages, showSubscribeMessage, showItemInfo }) => {
  const tInstructions = useTranslations("instructions");
  const tAuthentication = useTranslations("authentication");
  const { setModalAuthLogin } = useModals();

  useSkipInitialEffect(() => {
    scrollMainToTop();
  }, [clips]);
  
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
            totalPages={totalPages}
            setPage={setPage}>
            {clips.map((clip) => (
              <ListClipRow
                key={clip.id}
                channel={channel}
                item={item}
                clip={clip}
                showItemInfo={showItemInfo}
                playlist_id_text={null}
              />
            ))}
          </Pagination>
        )
      }
    </>
  );
};


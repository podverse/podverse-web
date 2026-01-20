"use client";

import { useTranslations } from "next-intl";
import { DTOAccount, QueryParamsSubscribedType } from "podverse-helpers";
import React from "react";
import { ListProfileNodes } from "./ListProfileNodes";
import { CallToActionMessage } from "../../CallToActionMessage/CallToActionMessage";
import Pagination from "../../Pagination/Pagination";
import { useModals } from "../../../contexts/Modals";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { scrollMainToTop } from "../../../utils/scroll";
import styles from "../../../styles/components/List/Profiles/ListProfiles.module.scss";

type Props = {
  page: number;
  setPage: (page: number) => void;
  accounts: DTOAccount[];
  totalPages: number;
  showSubscribeMessage: boolean;
  type: QueryParamsSubscribedType | null;
};

export const ListProfiles: React.FC<Props> = ({ page, setPage,
  accounts, totalPages, showSubscribeMessage }) => {
  const tInstructions = useTranslations("instructions");
  const tAuthentication = useTranslations("authentication");
  const { setModalAuthLogin } = useModals();

  useSkipInitialEffect(() => {
    scrollMainToTop();
  }, [accounts]);
  
  const showCallToAction = showSubscribeMessage;
  const showPagination = !showSubscribeMessage;

  const listNodes = ListProfileNodes({ accounts });

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

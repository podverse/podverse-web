"use client";

import { useTranslations } from "next-intl";
import { DTOQueueResource } from "podverse-helpers";
import React, { useRef } from "react";
import { CallToActionMessage } from "../../CallToActionMessage/CallToActionMessage";
import { useModals } from "../../../contexts/Modals";
import { checkBackNavFlag } from "../../../contexts/Navigation";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { scrollMainToTop } from "../../../utils/scroll";
import { ListQueueResourceRow } from "./ListQueueResourceRow";
import Pagination from "../../Pagination/Pagination";
import styles from "../../../styles/components/List/Queues/ListQueueResources.module.scss";

type Props = {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  queueResources: DTOQueueResource[];
  showLoginMessage: boolean;
};

export const ListHistoryResources: React.FC<Props> = ({
  queueResources, showLoginMessage, page, setPage, totalPages }) => {
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
  }, [queueResources]);

  const showCallToAction = showLoginMessage;
  const showPagination = !showLoginMessage;

  return (
    <>
      {showCallToAction && (
        <CallToActionMessage
          message={tInstructions("login_for_history")}
          buttonLabel={tAuthentication("login")}
          onButtonClick={() => setModalAuthLogin({ isOpen: true })}
        />
      )}
      {
        showPagination && (
          <div className={styles.listWrapper}>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              setPage={setPage}>
              <div className={styles.list}>
                {queueResources.map((queueResource) => (
                  <ListQueueResourceRow
                    key={queueResource.id}
                    queueResource={queueResource}
                    isEditModeQueue={false}
                  />
                ))}
              </div>
            </Pagination>
          </div>
        )
      }
    </>
  );
};

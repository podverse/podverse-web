"use client";

import { useTranslations } from "next-intl";
import { DTOQueueResource } from "podverse-helpers";
import React from "react";
import { CallToActionMessage } from "../../CallToActionMessage/CallToActionMessage";
import { useModals } from "../../../contexts/Modals";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { scrollMainToTop } from "../../../utils/scroll";
import { ListQueueResourceRow } from "./ListQueueResourceRow";
import styles from "../../../styles/components/List/Queues/ListQueueResources.module.scss";

type Props = {
  queueResources: DTOQueueResource[];
  showLoginMessage: boolean;
};

export const ListQueueResources: React.FC<Props> = ({ queueResources, showLoginMessage }) => {
  const tInstructions = useTranslations("instructions");
  const tAuthentication = useTranslations("authentication");
  const { setModalLogin } = useModals();

  useSkipInitialEffect(() => {
    scrollMainToTop();
  }, [queueResources]);

  const showCallToAction = showLoginMessage;
  const showPagination = !showLoginMessage;

  return (
    <>
      {showCallToAction && (
        <CallToActionMessage
          message={tInstructions("login_for_queues")}
          buttonLabel={tAuthentication("login")}
          onButtonClick={() => setModalLogin({ isOpen: true })}
        />
      )}
      {
        showPagination && (
          <div className={styles.listWrapper}>
            {queueResources.map((queueResource) => (
              <ListQueueResourceRow
                key={queueResource.id}
                queueResource={queueResource}
              />
            ))}
          </div>
        )
      }
    </>
  );
};

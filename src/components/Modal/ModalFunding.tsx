"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { Modal } from "./Modal";
import Link from "../Link/Link";
import styles from "../../styles/components/Modal/ModalFunding.module.scss";
import { useModals } from "../../contexts/Modals";

export const ModalFunding: React.FC = () => {
  const tInfo = useTranslations("info");
  const header = tInfo("funding");
  const { modalFunding, setModalFunding } = useModals();

  const isOpen = (
    (modalFunding.channel_fundings && modalFunding.channel_fundings.length > 0)
    || (modalFunding.item_fundings && modalFunding.item_fundings.length > 0)
  );
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setModalFunding({ channel_fundings: [], item_fundings: [] })}
      header={header}
      ariaLabel={header}
      modalContentMaxWidth={420}>
      <ul className={styles.fundingLinksList}>
        {modalFunding.channel_fundings?.map((channel_funding, idx) => (
          <li key={idx} className={styles.fundingLinkItem}>
            <Link
              href={channel_funding.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.fundingLink}
            >
              {channel_funding.title}
            </Link>
          </li>
        ))}
        {modalFunding.item_fundings?.map((item_funding, idx) => (
          <li key={idx} className={styles.fundingLinkItem}>
            <Link
              href={item_funding.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.fundingLink}
            >
              {item_funding.title}
            </Link>
          </li>
        ))}
      </ul>
    </Modal>
  );
};
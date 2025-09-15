"use client";

import { useTranslations } from "next-intl";
import { DTOChannelFunding, DTOItemFunding } from "podverse-helpers";
import React from "react";
import { Modal } from "./Modal";
import Link from "../Link/Link";
import styles from "../../styles/components/Modal/ModalFunding.module.scss";

type ModalFundingProps = {
  isOpen: boolean;
  onClose: () => void;
  channel_fundings?: DTOChannelFunding[];
  item_fundings?: DTOItemFunding[];
};

export const ModalFunding: React.FC<ModalFundingProps> = ({
  isOpen,
  onClose,
  channel_fundings,
  item_fundings
}) => {
  if (!isOpen) return null;
  const tInfo = useTranslations("info");
  const header = tInfo("funding");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={header}
      ariaLabel={header}
      modalContentMaxWidth={420}>
      <ul className={styles.fundingLinksList}>
        {channel_fundings?.map((channel_funding, idx) => (
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
        {item_fundings?.map((item_funding, idx) => (
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
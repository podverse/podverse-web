"use client";

import { useTranslations } from "next-intl";
import { DTOChannelFunding, DTOItemFunding } from "podverse-helpers";
import React from "react";
import { Modal } from "./Modal";
import Link from "../Link/Link";
import styles from "../../styles/components/Modal/ModalFunding.module.scss";

type ModalFundingLink = DTOChannelFunding | DTOItemFunding

type ModalFundingProps = {
  isOpen: boolean;
  onClose: () => void;
  links: ModalFundingLink[];
  header?: string;
  ariaLabel?: string;
};

export const ModalFunding: React.FC<ModalFundingProps> = ({
  isOpen,
  onClose,
  links
}) => {
  if (!isOpen) return null;
  const tInfo = useTranslations("info");
  const header = tInfo("funding");

  return (
    <Modal isOpen={isOpen} onClose={onClose} header={header} ariaLabel={header}>
      <ul className={styles.fundingLinksList}>
        {links.map((link, idx) => (
          <li key={idx} className={styles.fundingLinkItem}>
            <Link
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.fundingLink}
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </Modal>
  );
};
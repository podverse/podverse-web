"use client";

import React from 'react'
import { Modal } from './Modal'
import { useTranslations } from 'next-intl';

type ModalShareProps = {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalShare: React.FC<ModalShareProps> = ({ isOpen, onClose }) => {
  const tInfo = useTranslations("info");

  return (
    <Modal
      header={tInfo("share")}
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={tInfo("share")}
    >
      <div>Share Modal Content Here</div>
    </Modal>
  )
}

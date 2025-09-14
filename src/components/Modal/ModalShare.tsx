"use client";

import { useTranslations } from 'next-intl';
import React, { useRef, useState } from 'react'
import { Modal } from './Modal'
import { TextInput } from '../Form/TextInput';
import { copyToClipboard } from 'podverse-helpers';

type ModalShareProps = {
  isOpen: boolean;
  onClose: () => void;
  shareInputs: ModalShareInput[];
}

export type ModalShareInput = {
  name: string;
  value: string;
  eyebrow?: string;
};

export const ModalShare: React.FC<ModalShareProps> = ({ isOpen, onClose, shareInputs }) => {
  const tFeatures = useTranslations("features");
  const tInfo = useTranslations("info");

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = (value: string, idx: number) => {
    copyToClipboard(value);
    setCopiedIndex(idx);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };
  
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Modal
      header={tInfo("share")}
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={tInfo("share")}
    >
      {shareInputs.map((input, idx) => (
        <TextInput
          key={input.name}
          type="text"
          name={input.name}
          value={input.value}
          eyebrow={input.eyebrow}
          button={{
            label: copiedIndex === idx ? tFeatures("copied") : tFeatures("copy"),
            onClick: () => handleCopy(input.value, idx)
          }}
          readOnly
        />
      ))}
    </Modal>
  )
}

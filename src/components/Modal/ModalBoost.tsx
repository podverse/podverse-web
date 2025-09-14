"use client";

import { useTranslations } from "next-intl";
import { DTOChannel, DTOItem } from "podverse-helpers";
import React from "react";
import { Modal } from "./Modal";
import { BoostForm } from "../Boost/BoostForm";

type ModalBoostProps = {
  isOpen: boolean;
  onClose: () => void;
  channel: DTOChannel;
  item?: DTOItem;
};

export const ModalBoost: React.FC<ModalBoostProps> = ({
  isOpen,
  onClose,
  channel,
  item
}) => {
  if (!isOpen) return null;
  
  const tValue = useTranslations("value");
  const header = tValue("boost");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={header}
      ariaLabel={header}
      modalContentMaxWidth={500}>
      <BoostForm
        channel={channel}
        item={item}
      />
    </Modal>
  );
};
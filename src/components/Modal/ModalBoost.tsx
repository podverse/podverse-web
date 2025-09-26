"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { Modal } from "./Modal";
import { BoostForm } from "../Boost/BoostForm";
import { useModals } from "../../contexts/Modals";

export const ModalBoost: React.FC = () => {
  const { modalBoost, setModalBoost } = useModals();
  const tValue = useTranslations("value");
  const header = tValue("boost");
  
  if (!modalBoost.channel) return null;
  const isOpen = !!modalBoost.channel;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setModalBoost({})}
      header={header}
      ariaLabel={header}
      modalContentMaxWidth={500}>
      <BoostForm
        channel={modalBoost.channel}
        item={modalBoost.item}
      />
    </Modal>
  );
};

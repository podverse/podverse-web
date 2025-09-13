"use client";

import { useTranslations } from "next-intl";
import { DTOChannel, DTOItem } from "podverse-helpers";
import React from "react";
import { Modal } from "./Modal";
import { MediaHeaderMini } from "../MediaHeaderMini/MediaHeaderMini";

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
  const tInfo = useTranslations("info");
  const header = tInfo("boost");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={header}
      ariaLabel={header}
      modalContentMaxWidth={400}>
      <MediaHeaderMini channel={channel} item={item} />
    </Modal>
  );
};
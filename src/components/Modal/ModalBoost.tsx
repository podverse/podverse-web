"use client";

import { useTranslations } from "next-intl";
import { DTOChannel, DTOItem } from "podverse-helpers";
import React from "react";
import { Modal } from "./Modal";
import { MediaHeaderMini } from "../MediaHeaderMini/MediaHeaderMini";
import { BoostRecipientInfo } from "../Boost/BoostRecipientInfo";
import Accordion from "../Accordian/Accordian";
import styles from "../../styles/components/Modal/ModalBoost.module.scss";

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
  const tMisc = useTranslations("misc");
  const header = tValue("boost");

  /* TODO: support selecting channel_value and item_value */
  const channel_value_recipients = channel?.channel_values?.[0]?.channel_value_recipients;
  const item_value_recipients = item?.item_values?.[0]?.item_value_recipients;

  if (!channel_value_recipients && !item_value_recipients) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={header}
      ariaLabel={header}
      modalContentMaxWidth={500}>
      <MediaHeaderMini channel={channel} item={item} />
      <div className={styles.moreInfo}>
        <Accordion
          header={tMisc("more_info")}
          items={
            <BoostRecipientInfo
              channel_value_recipients={channel_value_recipients}
              item_value_recipients={item_value_recipients}
              amount={10000}
            />
          }
          size="small"
        />
      </div>
    </Modal>
  );
};
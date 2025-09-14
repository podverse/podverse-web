"use client";

import { useTranslations } from "next-intl";
import { AppValueRecipient, DTOChannelValueRecipient, DTOItemValueRecipient, normalizeChannelValueRecipients, normalizeItemValueRecipients } from "podverse-helpers";
import styles from "../../styles/components/Boost/BoostRecipientInfo.module.scss";
import { BoostRecipientInfoRow } from "./BoostRecipientInfoRow";

type BoostRecipientInfoProps = {
  channel_value_recipients?: DTOChannelValueRecipient[];
  item_value_recipients?: DTOItemValueRecipient[];
  app_value_recipient?: AppValueRecipient | null;
  totalAmountToCreator: number;
  totalAmountToApp: number;
};

export const BoostRecipientInfo = ({
  channel_value_recipients,
  item_value_recipients,
  app_value_recipient,
  totalAmountToCreator,
  totalAmountToApp
}: BoostRecipientInfoProps) => {
  const tValue = useTranslations("value");

  let rows: React.ReactNode[] = [];

  const normalized_channel_value_recipients = channel_value_recipients ? normalizeChannelValueRecipients(channel_value_recipients, totalAmountToCreator) : [];
  const normalized_item_value_recipients = item_value_recipients ? normalizeItemValueRecipients(item_value_recipients, totalAmountToCreator) : [];

  if (normalized_channel_value_recipients && normalized_item_value_recipients.length > 0) {
    rows = normalized_item_value_recipients.map((recipient, index) => (
      <BoostRecipientInfoRow
        key={index}
        normalized_item_value_recipient={recipient}
      />
    ));
  } else if (normalized_channel_value_recipients && normalized_channel_value_recipients.length > 0) {
    rows = normalized_channel_value_recipients.map((recipient, index) => (
      <BoostRecipientInfoRow
        key={index}
        normalized_channel_value_recipient={recipient}
      />
    ));
  }

  if (rows.length === 0) {
    return null;
  }

  const creatorHeaderLabel = rows.length > 1 ? tValue("recipient.creator_recipients") : tValue("recipient.creator_recipient");

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th>{creatorHeaderLabel}</th>
            <th>%</th>
            <th>{tValue("total")}</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
      {
        app_value_recipient && totalAmountToApp > 0 && (
          <table className={styles.table}>
            <thead>
              <tr className={styles.headerRow}>
                <th>{tValue("recipient.app_recipient")}</th>
                <th>%</th>
                <th>{tValue("total")}</th>
              </tr>
            </thead>
            <tbody>
              <BoostRecipientInfoRow app_value_recipient={app_value_recipient} />
            </tbody>
          </table>
        )
      }
    </>
  );
};

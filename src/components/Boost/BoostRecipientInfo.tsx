"use client";

import { useTranslations } from "next-intl";
import { DTOChannelValueRecipient, DTOItemValueRecipient } from "podverse-helpers";
import styles from "../../styles/components/Boost/BoostRecipientInfo.module.scss";
import { BoostRecipientInfoRow } from "./BoostRecipientInfoRow";

type BoostRecipientInfoProps = {
  channel_value_recipients?: DTOChannelValueRecipient[];
  item_value_recipients?: DTOItemValueRecipient[];
};

export const BoostRecipientInfo = ({
  channel_value_recipients,
  item_value_recipients,
}: BoostRecipientInfoProps) => {
  const tValue = useTranslations("value");

  let rows: React.ReactNode[] = [];

  if (item_value_recipients && item_value_recipients.length > 0) {
    rows = item_value_recipients.map((recipient, index) => (
      <BoostRecipientInfoRow
        key={index}
        item_value_recipient={recipient}
      />
    ));
  } else if (channel_value_recipients && channel_value_recipients.length > 0) {
    rows = channel_value_recipients.map((recipient, index) => (
      <BoostRecipientInfoRow
        key={index}
        channel_value_recipient={recipient}
      />
    ));
  }

  if (rows.length === 0) {
    return null;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.headerRow}>
          <th>{tValue("recipient")}</th>
          <th>%</th>
          <th>{tValue("total")}</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
};

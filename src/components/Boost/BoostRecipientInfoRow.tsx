import { NormalizedChannelValueRecipient, NormalizedItemValueRecipient } from "podverse-helpers"
import styles from "../../styles/components/Boost/BoostRecipientInfoRow.module.scss";

type BoostRecipientInfoRowProps = {
  normalized_channel_value_recipient?: NormalizedChannelValueRecipient;
  normalized_item_value_recipient?: NormalizedItemValueRecipient;
}

export const BoostRecipientInfoRow = ({ normalized_channel_value_recipient, normalized_item_value_recipient }: BoostRecipientInfoRowProps) => {

  const recipient = normalized_item_value_recipient ? normalized_item_value_recipient : normalized_channel_value_recipient;

  if (!recipient) {
    return null;
  }

  return (
    <tr className={styles.row}>
      <td>
        <div>{recipient.name}</div>
        <div className={styles.address}>{recipient.address}</div>
      </td>
      <td className={styles.percent}>{recipient.normalized_split}</td>
      <td className={styles.amount}>{recipient.final_amount}</td>
    </tr>
  )
}

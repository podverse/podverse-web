import { DTOChannelValueRecipient, DTOItemValueRecipient } from "podverse-helpers"
import styles from "../../styles/components/Boost/BoostRecipientInfoRow.module.scss";

type BoostRecipientInfoRowProps = {
  channel_value_recipient?: DTOChannelValueRecipient;
  item_value_recipient?: DTOItemValueRecipient;
}

export const BoostRecipientInfoRow = ({ channel_value_recipient, item_value_recipient }: BoostRecipientInfoRowProps) => {

  const recipient = item_value_recipient ? item_value_recipient : channel_value_recipient;

  if (!recipient) {
    return null;
  }

  return (
    <tr className={styles.row}>
      <td>
        <div>{recipient.name}</div>
        <div className={styles.address}>{recipient.address}</div>
      </td>
      <td className={styles.percent}>25</td>
      <td className={styles.amount}>333</td>
    </tr>
  )
}

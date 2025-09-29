import { TranscriptRow } from 'podverse-helpers';
import styles from "../../styles/components/ItemTranscript/ItemTranscriptRow.module.scss";

export const ItemTranscriptRow = ({ row }: { row: TranscriptRow }) => {
  return (
    <div className={styles.itemTranscriptRow}>
      {
        row.speaker && (
          <div className={styles.speaker}>
            {row.speaker}
          </div>
        )
      }
      <div className={styles.mainSection}>
        <div className={styles.text}>
          {row.body}
        </div>
        <div className={styles.time}>
          {row.startTimeFormatted}
        </div>
      </div>
    </div>
  )
}

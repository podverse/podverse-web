import { TranscriptRow, decodeHtmlEntities } from 'podverse-helpers';
import styles from "../../styles/components/ItemTranscript/ItemTranscriptRow.module.scss";
interface ItemTranscriptRowProps {
  row: TranscriptRow;
  highlight?: boolean;
  onClick?: () => void;
}

export const ItemTranscriptRow = ({ row, highlight, onClick }: ItemTranscriptRowProps) => {
  const decodedBody = decodeHtmlEntities(row.body);
  
  return (
    <div
      className={[
        styles.itemTranscriptRow,
        highlight ? "highlighted-text" : ''
      ].join(' ')}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : undefined }}
    >
      {row.speaker && (
        <div className={styles.speaker}>{row.speaker}</div>
      )}
      <div className={styles.mainSection}>
        <div className={styles.text}>{decodedBody}</div>
        <div className={styles.time}>{row.startTimeFormatted}</div>
      </div>
    </div>
  );
}

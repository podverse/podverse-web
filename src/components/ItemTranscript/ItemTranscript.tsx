import { TranscriptRow } from 'podverse-helpers';

import { ItemTranscriptRow } from './ItemTranscriptRow';
import { VirtualizedList } from '../VirtualizedList/VirtualizedList';

export const ItemTranscript = ({ rows }: { rows?: TranscriptRow[] }) => {
  if (!rows || rows.length === 0) {
    return null;
  }

  return (
    <VirtualizedList
      items={rows}
      height={400}
      renderItem={(row, idx) => (
        <ItemTranscriptRow key={row.line ?? idx} row={row} />
      )}
    />
  );
}

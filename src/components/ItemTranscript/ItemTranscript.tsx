import { TranscriptRow } from 'podverse-helpers';
import { ItemTranscriptRow } from './ItemTranscriptRow';
import { VirtualizedList } from '../VirtualizedList/VirtualizedList';
import { useMediaPlayerCurrentTime } from '../../contexts/MediaPlayerCurrentTime';
import { EVENTS } from '../../constants/events';

interface ItemTranscriptProps {
  rows?: TranscriptRow[];
  autoScrollOn?: boolean;
}

export const ItemTranscript = ({ rows, autoScrollOn }: ItemTranscriptProps) => {
  const { mpCurrentTime } = useMediaPlayerCurrentTime();

  if (!rows || rows.length === 0) {
    return null;
  }

  const handleRowClick = (startTime: number) => {
    window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.AUDIO.SEEK, {
      detail: { time: startTime }
    }));
  };

  const highlightedIndex = rows.findIndex(row =>
    typeof row.startTime === 'number' && typeof row.endTime === 'number' &&
    mpCurrentTime >= row.startTime && mpCurrentTime < row.endTime
  );

  return (
    <VirtualizedList
      items={rows}
      height={400}
      highlightedIndex={highlightedIndex}
      autoScrollOn={!!autoScrollOn}
      renderItem={(row, idx) => (
        <ItemTranscriptRow
          key={row.line ?? idx}
          row={row}
          highlight={
            typeof row.startTime === 'number' && typeof row.endTime === 'number' &&
            mpCurrentTime >= row.startTime && mpCurrentTime < row.endTime
          }
          onClick={() => handleRowClick(row.startTime)}
        />
      )}
    />
  );
}

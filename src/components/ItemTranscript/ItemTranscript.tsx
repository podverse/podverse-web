import { useTranslations } from 'next-intl';
import { TranscriptRow } from 'podverse-helpers';
import { useState, useMemo } from 'react';
import { ItemTranscriptRow } from './ItemTranscriptRow';
import { SearchInput } from '../Form/SearchInput';
import { VirtualizedList } from '../VirtualizedList/VirtualizedList';
import { EVENTS } from '../../constants/events';
import { useMediaPlayerCurrentTime } from '../../contexts/MediaPlayerCurrentTime';
import styles from '../../styles/components/ItemTranscript/ItemTranscript.module.scss';

interface ItemTranscriptProps {
  rows: TranscriptRow[];
  autoScrollOn?: boolean;
}

export const ItemTranscript = ({ rows, autoScrollOn }: ItemTranscriptProps) => {
  const tInfo = useTranslations("info");
  const { mpCurrentTime } = useMediaPlayerCurrentTime();

  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleRowClick = (startTime: number) => {
    window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.AUDIO.SEEK, {
      detail: { time: startTime }
    }));
  };
  
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;
    const lowerSearch = searchTerm.toLowerCase();
    return rows.filter(row =>
      row.body?.toLowerCase().includes(lowerSearch)
    );
  }, [rows, searchTerm]);

  const highlightedIndex = filteredRows.findIndex(row =>
    typeof row.startTime === 'number' && typeof row.endTime === 'number' &&
    mpCurrentTime >= row.startTime && mpCurrentTime < row.endTime
  );

  return (
    <div className={styles.transcriptWrapper}>
      <div className={styles.transcriptSearch}>
        <SearchInput
          onSearch={(value) => setSearchTerm(value)}
          placeholder={tInfo("transcript.search_transcript")}
        />
      </div>
      <VirtualizedList
        items={filteredRows}
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
    </div>
  );
}

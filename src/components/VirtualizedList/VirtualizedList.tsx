"use client";

import { useEffect, useRef } from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  highlightedIndex?: number;
  autoScrollOn?: boolean;
}

export function VirtualizedList<T>({ items, height, renderItem, highlightedIndex, autoScrollOn }: VirtualizedListProps<T>) {

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  useEffect(() => {
    if (
      autoScrollOn &&
      virtuosoRef.current &&
      highlightedIndex !== undefined &&
      highlightedIndex >= 0
    ) {
      const scrollIndex = Math.max(0, highlightedIndex);
      virtuosoRef.current.scrollToIndex({ index: scrollIndex, align: 'start', behavior: 'smooth' });
    }
  }, [highlightedIndex, autoScrollOn]);

  return (
    <Virtuoso
      ref={virtuosoRef}
      style={{ height }}
      totalCount={items.length}
      itemContent={(index: number) => renderItem(items[index], index)}
      followOutput={highlightedIndex !== undefined && highlightedIndex >= 0 ? 'auto' : false}
      {...(highlightedIndex !== undefined && highlightedIndex >= 0 ? { initialTopMostItemIndex: highlightedIndex } : {})}
    />
  );
}

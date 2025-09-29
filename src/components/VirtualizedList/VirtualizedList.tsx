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

export function VirtualizedList<T>({ items, height, renderItem, highlightedIndex }: VirtualizedListProps<T>) {

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  useEffect(() => {
    if (
      virtuosoRef.current &&
      highlightedIndex !== undefined &&
      highlightedIndex >= 0
    ) {
      const scrollIndex = Math.max(0, highlightedIndex - 2);
      virtuosoRef.current.scrollToIndex({ index: scrollIndex, align: 'start', behavior: 'smooth' });
    }
  }, [highlightedIndex]);

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

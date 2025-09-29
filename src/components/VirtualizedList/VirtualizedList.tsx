"use client";

import { Virtuoso } from 'react-virtuoso';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export function VirtualizedList<T>({ items, height, renderItem }: VirtualizedListProps<T>) {
  return (
    <Virtuoso
      style={{ height }}
      totalCount={items.length}
      itemContent={(index: number) => renderItem(items[index], index)}
    />
  );
}

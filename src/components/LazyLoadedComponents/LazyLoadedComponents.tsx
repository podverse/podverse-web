"use client";

import dynamic from 'next/dynamic';
import { ErrorBoundaryWrapper } from '../ErrorBoundary/ErrorBoundaryWrapper';

const LazyMediaPlayer = dynamic(() => import('../MediaPlayer/MediaPlayer').then(mod => ({ default: mod.MediaPlayer })), {
  ssr: false,
  loading: () => <div aria-label="Loading media player" style={{ display: 'none' }} />
});

const LazyModals = dynamic(() => import('../Modals/Modals').then(mod => ({ default: mod.Modals })), {
  ssr: false
});

export function LazyLoadedComponents() {
  return (
    <>
      <ErrorBoundaryWrapper>
        <LazyMediaPlayer />
      </ErrorBoundaryWrapper>
      <ErrorBoundaryWrapper>
        <LazyModals />
      </ErrorBoundaryWrapper>
    </>
  );
}

"use client";

import React from 'react'
import { ModalShare } from '../../../components/Modal/ModalShare'
import { usePodcastContext } from './PodcastContext';

export const PodcastModalShare: React.FC = () => {
  const { podcastModalShareIsOpen, setPodcastModalShareIsOpen } = usePodcastContext();

  return (
    <ModalShare
      isOpen={podcastModalShareIsOpen}
      onClose={() => setPodcastModalShareIsOpen(false)}
    />
  )
}

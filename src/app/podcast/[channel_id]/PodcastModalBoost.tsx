"use client";

import { DTOChannel } from 'podverse-helpers';
import React from 'react'
import { usePodcastContext } from './PodcastContext';
import { ModalBoost } from '../../../components/Modal/ModalBoost';

type PodcastModalBoostProps = {
  channel: DTOChannel;
}

export const PodcastModalBoost: React.FC<PodcastModalBoostProps> = ({ channel }) => {
  const { podcastModalBoostIsOpen, setPodcastModalBoostIsOpen } = usePodcastContext();

  return (
    <ModalBoost
      isOpen={podcastModalBoostIsOpen}
      onClose={() => setPodcastModalBoostIsOpen(false)}
      channel={channel}
    />
  )
}

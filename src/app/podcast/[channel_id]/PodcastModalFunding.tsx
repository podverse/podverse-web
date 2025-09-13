"use client";

import { DTOChannel } from 'podverse-helpers';
import React from 'react'
import { usePodcastContext } from './PodcastContext';
import { ModalFunding } from '../../../components/Modal/ModalFunding';

type PodcastModalFundingProps = {
  channel: DTOChannel;
}

export const PodcastModalFunding: React.FC<PodcastModalFundingProps> = ({ channel }) => {
  const { podcastModalFundingIsOpen, setPodcastModalFundingIsOpen } = usePodcastContext();

  const fundingLinks = channel.channel_fundings || [];

  return (
    <ModalFunding
      isOpen={podcastModalFundingIsOpen}
      onClose={() => setPodcastModalFundingIsOpen(false)}
      links={fundingLinks}
    />
  )
}
